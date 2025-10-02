// Chat SDK Service - Better alternative to RTM
import { ChatManager } from 'agora-chat-sdk';

let chatClient = null;
let currentConnection = null;

export const initChat = async (appId, userId, channelId, onMessageReceived) => {
  try {
    if (!appId) {
      console.warn('Agora App ID not provided, chat will not work');
      return false;
    }

    // Create Chat SDK client
    chatClient = new ChatManager({
      appId: appId,
      useHttps: true,
      isHttpDNS: true,
    });

    // Login as guest (no authentication needed for testing)
    await chatClient.open({
      user: userId,
      accessToken: '', // Empty for guest mode
    });

    console.log('✅ Chat SDK initialized successfully');

    // Join group/channel
    await chatClient.joinGroup({
      groupId: channelId,
    });

    // Set up message listener
    chatClient.addEventHandler('messageHandler', {
      onTextMessage: (message) => {
        if (onMessageReceived && message.from !== userId) {
          onMessageReceived(message.msg, message.from);
        }
      },
      onCmdMessage: (message) => {
        console.log('Command message received:', message);
      },
    });

    currentConnection = {
      appId,
      userId,
      channelId,
      isConnected: true,
    };

    return true;
  } catch (error) {
    console.error('❌ Error initializing Chat SDK:', error);
    return false;
  }
};

export const sendChatMessage = async (text, channelId) => {
  try {
    if (!chatClient || !currentConnection?.isConnected) {
      console.error('Chat client not connected');
      return false;
    }

    const message = ChatManager.message.create({
      type: 'txt',
      to: channelId,
      chatType: 'groupChat',
      msg: text,
    });

    await chatClient.send(message);
    console.log('✅ Message sent via Chat SDK');
    return true;
  } catch (error) {
    console.error('❌ Error sending message:', error);
    return false;
  }
};

export const leaveChat = async () => {
  try {
    if (chatClient && currentConnection) {
      // Leave group
      await chatClient.leaveGroup({
        groupId: currentConnection.channelId,
      });

      // Logout
      await chatClient.close();
      
      chatClient = null;
      currentConnection = null;
    }
    
    console.log('✅ Chat SDK disconnected');
    return true;
  } catch (error) {
    console.error('❌ Error leaving chat:', error);
    return false;
  }
};

export default {
  initChat,
  sendChatMessage,
  leaveChat,
};
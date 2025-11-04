import ChatPageLayout from "../layouts/user/ChatPageLayout";
import MessagePage from "../pages/user/MessagePage";
import { MessageProvider } from "../contexts/MessageContext";

const MessagePageRoutes = [
  {
    path: "/messages",
    element: (
      <MessageProvider>
        <ChatPageLayout />
      </MessageProvider>
    ),
    children: [
      {
        path: "",
        element: <MessagePage />,
      },
    ],
  },
];

export default MessagePageRoutes;
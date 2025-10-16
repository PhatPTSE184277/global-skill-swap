# 🤖 Floating Chat AI Widget - Hướng Dẫn Sử Dụng

## 📋 Tổng Quan

Widget Chat AI nổi (Floating Chat AI) được tích hợp vào Homepage để hỗ trợ người dùng:

- 🌐 **Dịch văn bản** từ Tiếng Anh/Trung sang Tiếng Việt
- 💬 **Trò chuyện** với AI thông minh
- 🎯 Giao diện tối giản, hiện đại, UX thân thiện

## 🎨 Tính Năng

### 1. Hai Chế Độ Hoạt Động

#### 🌐 Chế Độ Dịch Văn Bản

- Tự động phát hiện ngôn ngữ (Tiếng Anh/Trung)
- Dịch sang Tiếng Việt tức thì
- Hiển thị ngôn ngữ nguồn

#### 💬 Chế Độ Trò Chuyện

- Chat với AI có ngữ cảnh
- Lưu lịch sử hội thoại (tối đa 20 tin nhắn)
- Phản hồi thông minh và tự nhiên

### 2. Giao Diện & UX

- ✅ **Floating Button**: Nút nổi ở góc phải màn hình với hiệu ứng hover
- ✅ **Badge "AI"**: Nhấn mạnh tính năng AI
- ✅ **Minimize**: Thu nhỏ widget khi không dùng
- ✅ **Responsive**: Tự động điều chỉnh theo màn hình
- ✅ **Animation**: Hiệu ứng mượt mà, chuyên nghiệp
- ✅ **Auto-scroll**: Tự động cuộn xuống tin nhắn mới
- ✅ **Keyboard shortcuts**: Enter để gửi, Shift+Enter để xuống dòng

### 3. Tính Năng Bổ Sung

- 🗑️ **Xóa lịch sử**: Nút xóa hội thoại
- ⌨️ **Auto-focus**: Tự động focus input khi mở
- ⏰ **Timestamp**: Hiển thị thời gian từng tin nhắn
- 🔄 **Loading state**: Hiển thị trạng thái loading
- ❌ **Error handling**: Xử lý lỗi thân thiện

## 🚀 Cài Đặt

### 1. File Structure

```
src/
├── services/
│   └── chatAIService.js          # Service gọi API
├── components/
│   └── client/
│       └── ChatAI/
│           ├── FloatingChatAI.jsx # Component chính
│           └── index.js           # Export
└── pages/
    └── client/
        └── HomePage.jsx           # Tích hợp widget
```

### 2. Dependencies

Đảm bảo các package sau đã được cài đặt:

```json
{
  "axios": "^1.x.x",
  "lucide-react": "^0.x.x",
  "react": "^18.x.x"
}
```

### 3. Environment Variables

Kiểm tra file `.env`:

```env
VITE_ROOM_SERVICE_URL=https://gss-room-service.onrender.com
```

## 💻 Sử Dụng

### Import và Sử Dụng

```jsx
import FloatingChatAI from "../../components/client/ChatAI/FloatingChatAI";

function HomePage() {
  return (
    <div>
      {/* Your page content */}

      {/* Floating Chat AI Widget */}
      <FloatingChatAI />
    </div>
  );
}
```

### Tích Hợp Vào Trang Khác

Bạn có thể tích hợp widget vào bất kỳ trang nào:

```jsx
import { FloatingChatAI } from "../../components/client/ChatAI";

function AnyPage() {
  return (
    <>
      <YourContent />
      <FloatingChatAI />
    </>
  );
}
```

## 🎯 API Endpoints Sử Dụng

### 1. Dịch Văn Bản

```
POST /api/chat/translate
Body: {
  "text": "Hello world",
  "sourceLang": "en" // "en", "zh", hoặc "auto"
}
```

### 2. Chat Với Lịch Sử

```
POST /api/chat/conversation
Body: {
  "message": "Xin chào",
  "history": [
    {
      "userMessage": "Hi",
      "aiResponse": "Hello! How can I help?"
    }
  ]
}
```

### 3. Phát Hiện Ngôn Ngữ

```
POST /api/chat/detect-language
Body: {
  "text": "Hello"
}
```

## 🎨 Customization

### Thay Đổi Màu Sắc

Trong `FloatingChatAI.jsx`, bạn có thể tùy chỉnh màu:

```jsx
// Nút chính
className = "bg-gradient-to-r from-blue-500 to-blue-600";

// Header
className = "bg-gradient-to-r from-blue-500 to-blue-600";

// Tin nhắn user
className = "bg-blue-500 text-white";

// Tin nhắn AI
className = "bg-gray-100 text-gray-800";
```

### Thay Đổi Vị Trí

```jsx
// Góc phải dưới (mặc định)
className = "fixed bottom-6 right-6";

// Góc trái dưới
className = "fixed bottom-6 left-6";

// Góc phải trên
className = "fixed top-6 right-6";
```

### Thay Đổi Kích Thước

```jsx
// Widget mở
className = "w-96 h-[600px]";

// Widget thu nhỏ
className = "w-80 h-16";
```

## 🔧 Troubleshooting

### 1. API không hoạt động

```js
// Kiểm tra trong chatAIService.js
console.log("API URL:", this.baseURL);
```

**Giải pháp:**

- Kiểm tra `.env` có đúng URL không
- Kiểm tra backend có đang chạy không
- Kiểm tra CORS settings

### 2. Widget không hiển thị

**Giải pháp:**

- Kiểm tra import đúng component chưa
- Kiểm tra console có lỗi JavaScript không
- Kiểm tra z-index (mặc định: z-50)

### 3. Tin nhắn không gửi được

**Giải pháp:**

- Mở DevTools → Network để xem request
- Kiểm tra response từ API
- Kiểm tra error message trong state

### 4. Style bị lỗi

**Giải pháp:**

- Đảm bảo Tailwind CSS đã được cấu hình
- Kiểm tra file `tailwind.config.js`
- Restart dev server

## 📱 Responsive Design

Widget tự động responsive:

- **Desktop**: Full size (384px x 600px)
- **Tablet**: Tự động điều chỉnh
- **Mobile**: Tự động điều chỉnh, max-height theo viewport

## 🎭 Animation Details

### Fade In Animation

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Hover Effects

- Floating button: Scale 1.1 + Rotate 12deg
- Send button: Scale 1.05
- Mode buttons: Shadow + Background change

## 🔒 Security

### Best Practices

1. **API Key Security**: Không expose API key trong frontend
2. **Input Validation**: Backend phải validate input
3. **Rate Limiting**: Backend nên có rate limiting
4. **XSS Protection**: Input được sanitize tự động bởi React

## 📊 Performance

### Optimization Tips

1. **Lazy Loading**: Component chỉ render khi cần
2. **Message Limit**: Giới hạn 20 tin nhắn trong history
3. **Auto-cleanup**: Xóa history khi close widget
4. **Debounce**: Có thể thêm debounce cho input

## 🎓 Best Practices

### Sử Dụng Service Layer

```js
import chatAIService from '../services/chatAIService';

// ✅ Tốt - Sử dụng service
const response = await chatAIService.translate(text, 'en');

// ❌ Không tốt - Gọi API trực tiếp
const response = await axios.post('...', {...});
```

### Error Handling

```js
try {
  const response = await chatAIService.translate(text, "en");
  // Handle success
} catch (error) {
  // Handle error với thông báo thân thiện
  console.error("Translation failed:", error.message);
}
```

## 🚀 Future Enhancements

Các tính năng có thể thêm trong tương lai:

- [ ] 🔊 Text-to-Speech
- [ ] 🎤 Speech-to-Text
- [ ] 📁 File upload và dịch
- [ ] 💾 Lưu lịch sử vào localStorage
- [ ] 🌙 Dark mode
- [ ] 🔔 Notification sounds
- [ ] 📌 Pin important messages
- [ ] 🔍 Search in conversation
- [ ] 📤 Export conversation
- [ ] 🎨 Customizable themes

## 📝 Testing

### Manual Testing

1. **Test Dịch Tiếng Anh**

   - Input: "Hello, how are you?"
   - Expected: Dịch sang tiếng Việt

2. **Test Dịch Tiếng Trung**

   - Input: "你好，今天天气很好"
   - Expected: Dịch sang tiếng Việt

3. **Test Chat Mode**

   - Input: "What is Vietnam?"
   - Expected: Câu trả lời chi tiết

4. **Test Clear History**

   - Click nút xóa
   - Expected: Tất cả tin nhắn bị xóa

5. **Test Minimize/Close**
   - Click minimize → Widget thu nhỏ
   - Click close → Widget đóng

## 🤝 Support

Nếu gặp vấn đề:

1. Check console logs
2. Check Network tab
3. Verify API endpoints
4. Check environment variables
5. Restart dev server

## 📄 License

MIT License - Free to use and modify

---

**Made with ❤️ by Global Skill Swap Team**

🌐 Homepage Integration Complete!

# ⚡ Quick Start - Feedback System

## 🎯 Các File Đã Tạo

### 1. Services

- ✅ `src/services/feedbackService.js` - API client

### 2. Admin Pages

- ✅ `src/pages/admin/FeedbackPage/FeedbackManagementPage.jsx`

### 3. User Pages

- ✅ `src/pages/user/ServiceFeedbackPage.jsx`

### 4. Components

- ✅ `src/components/client/ChatAI/ChatAIFeedbackPopup.jsx`
- ✅ `src/components/client/ChatAI/FloatingChatAI.jsx` (updated)

### 5. Routes (Updated)

- ✅ `src/routes/admin/AdminPageRoutes.jsx`
- ✅ `src/routes/UserPageRoutes.jsx`

### 6. Navigation (Updated)

- ✅ `src/components/client/Navbar.jsx`
- ✅ `src/components/admin/AdminSidebar.jsx`

---

## 🔗 URLs

### User

- **Đánh giá dịch vụ:** http://localhost:5173/feedback

### Admin

- **Quản lý feedback:** http://localhost:5173/admin/feedbacks

---

## 🎨 Giao Diện

### Màu Sắc

- **Primary:** Purple-900 (#581c87)
- **Secondary:** Orange-500 (#f97316)
- **Background:** Gray-50 (#f9fafb)

### Icons

- Sử dụng `lucide-react`
- Mỗi service có màu icon riêng
- Mỗi status có icon riêng

---

## ⚙️ Cấu Hình Backend

### Base URL

```javascript
const BASE_URL = "http://localhost:3000/api/feedbacks";
```

Đảm bảo backend đang chạy trên port 3000!

---

## 🚨 TODO

### 1. Authentication

Thay thế hardcoded user ID:

```javascript
// Current (line 18, 29)
const currentUserId = "user001";

// Replace with
const { user } = useAuth();
const currentUserId = user?.id;
```

**Files cần sửa:**

- `ServiceFeedbackPage.jsx`
- `FloatingChatAI.jsx`
- `FeedbackManagementPage.jsx`

### 2. Testing

- [ ] Test tạo feedback
- [ ] Test popup ChatAI (sau 5 tin nhắn)
- [ ] Test admin phản hồi
- [ ] Test filters và pagination
- [ ] Test responsive mobile

### 3. Optional Enhancements

- [ ] Thêm loading states tốt hơn
- [ ] Toast notifications
- [ ] Confirmation dialogs
- [ ] Empty states với illustrations

---

## 📝 Cách Test

### Test User Feedback

```bash
1. Chạy app: npm run dev
2. Mở: http://localhost:5173/feedback
3. Chọn dịch vụ (vd: Chatbot AI)
4. Đánh giá 5 sao
5. Viết comment
6. Click "Gửi Đánh Giá"
7. Kiểm tra thông báo thành công
```

### Test ChatAI Popup

```bash
1. Mở homepage
2. Mở ChatAI (floating button)
3. Gửi 5 tin nhắn
4. Popup sẽ hiện lên
5. Test "Để sau" và "Gửi đánh giá"
```

### Test Admin

```bash
1. Đăng nhập admin
2. Mở: http://localhost:5173/admin/feedbacks
3. Xem statistics
4. Test filters
5. Click "Phản Hồi" trên feedback pending
6. Viết phản hồi và gửi
7. Test archive/delete
```

---

## 🐛 Common Issues

### Issue: API 404

```
Solution: Kiểm tra backend đang chạy và endpoint đúng
```

### Issue: Popup không hiện

```
Solution:
1. Clear localStorage: localStorage.clear()
2. Reset message count
3. Check userMessageCount >= 5
```

### Issue: Styling lỗi

```
Solution:
1. Check Tailwind config
2. Rebuild: npm run dev
3. Clear cache
```

---

## 📚 Docs

Xem chi tiết: `FEEDBACK_SYSTEM_README.md`

---

**🎉 System Ready! Start Testing!**

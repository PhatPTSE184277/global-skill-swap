# 🌟 Hệ Thống Feedback - Global Skill Swap

## 📋 Tổng Quan

Hệ thống feedback hoàn chỉnh cho ứng dụng Global Skill Swap, bao gồm:

- ✅ Trang quản lý feedback cho Admin
- ⭐ Trang đánh giá dịch vụ cho User
- 🤖 Popup feedback tự động cho ChatAI sau 5 tin nhắn
- 🎨 Giao diện cam-tím đồng bộ, hiện đại

---

## 📁 Cấu Trúc Files

```
src/
├── services/
│   └── feedbackService.js              # API service cho feedback
├── pages/
│   ├── admin/
│   │   └── FeedbackPage/
│   │       └── FeedbackManagementPage.jsx   # Trang quản lý admin
│   └── user/
│       └── ServiceFeedbackPage.jsx     # Trang đánh giá dịch vụ
├── components/
│   └── client/
│       └── ChatAI/
│           ├── FloatingChatAI.jsx      # Đã tích hợp popup
│           └── ChatAIFeedbackPopup.jsx # Popup feedback
├── routes/
│   ├── admin/
│   │   └── AdminPageRoutes.jsx         # Route admin
│   └── UserPageRoutes.jsx              # Route user
└── components/
    ├── client/
    │   └── Navbar.jsx                  # Navbar với link feedback
    └── admin/
        └── AdminSidebar.jsx            # Sidebar với menu feedback
```

---

## 🚀 Tính Năng

### 👨‍💼 Trang Admin Feedback Management

**Đường dẫn:** `/admin/feedbacks`

**Chức năng:**

- 📊 Thống kê tổng quan (Tổng feedback, Điểm TB, Chờ xử lý, Đã phản hồi)
- 🔍 Lọc theo module type và trạng thái
- 💬 Phản hồi feedback của user
- 📦 Lưu trữ feedback
- 🗑️ Xóa feedback
- 📄 Phân trang

**Components:**

- Statistics Cards: Hiển thị số liệu tổng quan
- Filters: Lọc theo module và trạng thái
- Table: Danh sách feedback với đầy đủ thông tin
- Response Modal: Form phản hồi feedback

**Screenshot Features:**

```
┌─────────────────────────────────────────┐
│  📊 Thống Kê                            │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │ 150  │ │ 4.5  │ │  10  │ │ 135  │  │
│  │Tổng  │ │Điểm  │ │Chờ   │ │Phản  │  │
│  └──────┘ └──────┘ └──────┘ └──────┘  │
├─────────────────────────────────────────┤
│  🔍 Bộ Lọc                              │
│  [Module ▼] [Trạng thái ▼] [Tìm kiếm]  │
├─────────────────────────────────────────┤
│  📋 Danh Sách Feedback                  │
│  ┌───────────────────────────────────┐ │
│  │ Module │ User │ ⭐ │ Comment │...  │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

### ⭐ Trang User Service Feedback

**Đường dẫn:** `/feedback`

**Chức năng:**

- 🎯 Chọn dịch vụ để đánh giá (6 loại)
- ⭐ Đánh giá 1-5 sao
- 💬 Viết nhận xét chi tiết
- 📊 Xem thống kê dịch vụ
- 📝 Xem feedback trước đó của mình
- ✅ Thông báo thành công

**Các dịch vụ:**

1. 🎥 Phòng Họp Trực Tuyến
2. 👨‍🏫 Mentor
3. 📚 Khóa Học
4. 🤖 Chatbot AI
5. ⚙️ Hệ Thống
6. ❓ Khác

**UI Flow:**

```
┌─────────────────────────┐
│  Chọn Dịch Vụ           │
│  ┌─────┐ ┌─────┐        │
│  │ 🎥  │ │ 👨‍🏫 │        │
│  │Phòng│ │Mentơ│        │
│  └─────┘ └─────┘        │
└─────────────────────────┘
         ↓
┌─────────────────────────┐
│  Form Đánh Giá          │
│  ⭐⭐⭐⭐⭐             │
│  ┌───────────────────┐  │
│  │ Nhận xét...       │  │
│  └───────────────────┘  │
│  [Gửi Đánh Giá]         │
└─────────────────────────┘
         ↓
┌─────────────────────────┐
│  ✅ Thành Công!         │
│  Cảm ơn bạn đã đóng góp │
└─────────────────────────┘
```

---

### 🤖 Popup Feedback ChatAI

**Hiển thị khi:**

- User đã gửi 5 tin nhắn chat
- User chưa feedback cho module `chatbot`
- Chưa bị skip trong 7 ngày gần đây

**Chức năng:**

- ⭐ Đánh giá nhanh 1-5 sao
- 💬 Nhận xét (không bắt buộc)
- ⏭️ Nút "Để sau" (ẩn 7 ngày)
- 🎉 Thông báo cảm ơn

**UI:**

```
╔══════════════════════════════╗
║  🤖 Đánh giá Chatbot AI      ║
║                              ║
║  Bạn thấy trải nghiệm chat   ║
║  với AI thế nào?             ║
║                              ║
║  ⭐ ⭐ ⭐ ⭐ ⭐              ║
║                              ║
║  ┌────────────────────────┐  ║
║  │ Nhận xét (tùy chọn)... │  ║
║  └────────────────────────┘  ║
║                              ║
║  [Để sau]  [Gửi đánh giá]   ║
╚══════════════════════════════╝
```

---

## 🎨 Thiết Kế UI/UX

### Màu Sắc Chủ Đạo

```css
/* Purple (Primary) */
purple-900: #581c87   /* Buttons, Headers */
purple-100: #f3e8ff   /* Backgrounds */

/* Orange (Secondary/Accent) */
orange-500: #f97316   /* Stats, Highlights */
orange-100: #ffedd5   /* Backgrounds */

/* Supporting Colors */
gray-50:  #f9fafb    /* Page background */
gray-100: #f3f4f6    /* Card backgrounds */
gray-300: #d1d5db    /* Borders */
```

### Principles

✅ **Không dùng gradient** - Màu solid rõ ràng
✅ **Border radius lớn** - rounded-xl, rounded-2xl
✅ **Shadow nhẹ** - shadow-sm, shadow-lg
✅ **Spacing rộng** - p-6, p-8, gap-6
✅ **Typography rõ ràng** - font-bold, font-medium
✅ **Icons với màu sắc** - Mỗi loại có màu riêng
✅ **Hover effects** - hover:scale-105, hover:shadow-lg
✅ **Animation smooth** - transition-all duration-300

---

## 🔧 API Integration

### Backend API

**Base URL:** `http://localhost:3000/api/feedbacks`

### Các Endpoint Sử Dụng

```javascript
// 1. Tạo feedback mới
POST /api/feedbacks
Body: {
  module_type: 'chatbot',
  module_id: 'ai-assistant',
  user_id: 'user001',
  rating: 5,
  comment: 'Rất tốt!'
}

// 2. Lấy tất cả feedbacks (Admin)
GET /api/feedbacks?page=1&limit=10

// 3. Lấy feedbacks theo module
GET /api/feedbacks/module/chatbot

// 4. Lấy feedbacks của user
GET /api/feedbacks/user/user001

// 5. Lấy thống kê
GET /api/feedbacks/statistics?module_type=chatbot

// 6. Admin phản hồi
PUT /api/feedbacks/:id/respond
Body: {
  admin_response: 'Cảm ơn bạn!',
  admin_id: 'admin01'
}

// 7. Xóa feedback
DELETE /api/feedbacks/:id
```

---

## 📝 Cách Sử Dụng

### 1️⃣ Cho User

**Đánh giá dịch vụ:**

1. Click "Dịch Vụ & Đánh Giá" trên navbar
2. Chọn dịch vụ muốn đánh giá
3. Cho điểm 1-5 sao
4. Viết nhận xét
5. Click "Gửi Đánh Giá"

**Feedback ChatAI:**

- Popup tự động hiện sau 5 tin nhắn chat
- Có thể click "Để sau" để đánh giá lần khác
- Hoặc đánh giá ngay và gửi

### 2️⃣ Cho Admin

**Quản lý feedback:**

1. Vào `/admin/feedbacks`
2. Xem thống kê tổng quan
3. Lọc theo module/trạng thái
4. Click "Phản Hồi" trên feedback pending
5. Viết phản hồi và gửi
6. Có thể lưu trữ hoặc xóa feedback

---

## 🔐 TODO: Authentication

**Hiện tại:**

```javascript
const currentUserId = "user001"; // Hardcoded
```

**Cần thay thế bằng:**

```javascript
// Get from auth context
import { useAuth } from "../contexts/AuthContext";

const { user } = useAuth();
const currentUserId = user?.id;
```

**Files cần cập nhật:**

- `ServiceFeedbackPage.jsx` (line 18)
- `FloatingChatAI.jsx` (line 29)
- `FeedbackManagementPage.jsx` (admin_id in response)

---

## 📊 Module Types

| Module Type    | Label      | Mô Tả                           |
| -------------- | ---------- | ------------------------------- |
| `meeting_room` | Phòng Họp  | Đánh giá phòng họp trực tuyến   |
| `mentor`       | Mentor     | Đánh giá mentor/người hướng dẫn |
| `user`         | User       | Đánh giá người dùng khác        |
| `course`       | Khóa Học   | Đánh giá khóa học               |
| `system`       | Hệ Thống   | Đánh giá hệ thống tổng thể      |
| `chatbot`      | Chatbot AI | Đánh giá trải nghiệm chat AI    |
| `other`        | Khác       | Các góp ý khác                  |

---

## 🐛 Troubleshooting

### Popup không hiện

**Kiểm tra:**

```javascript
// 1. Check localStorage
localStorage.getItem("chatAIFeedbackSkipped");

// 2. Check message count
console.log(userMessageCount);

// 3. Check user feedback
feedbackService.checkUserFeedback(userId, "chatbot");
```

### API Error

**Debug:**

```javascript
try {
  const response = await feedbackService.createFeedback(data);
} catch (error) {
  console.error("Error details:", error);
  // Check: network, CORS, server status
}
```

### Styling Issues

**Kiểm tra:**

- Tailwind classes đúng
- Import lucide-react icons
- Z-index cho modal/popup
- Responsive breakpoints (md:, lg:)

---

## 🚀 Future Enhancements

### Phase 2

- [ ] Upload ảnh trong feedback
- [ ] Emoji reactions
- [ ] Filter theo rating (1-5 sao)
- [ ] Export feedback to CSV
- [ ] Email notifications cho admin

### Phase 3

- [ ] AI sentiment analysis
- [ ] Bulk actions (archive/delete nhiều)
- [ ] Advanced analytics dashboard
- [ ] Feedback templates
- [ ] Auto-reply suggestions

---

## 📞 Support

**Issues:** Contact team lead
**API Docs:** http://localhost:3000/api-docs
**Design System:** Figma (if available)

---

## ✅ Testing Checklist

### User Flow

- [ ] Navbar link hoạt động
- [ ] Service selection works
- [ ] Star rating interactive
- [ ] Comment validation (max 1000 chars)
- [ ] Submit creates feedback
- [ ] Success message shows
- [ ] Previous feedbacks display

### ChatAI Popup

- [ ] Shows after 5 messages
- [ ] Doesn't show if already gave feedback
- [ ] "Để sau" hides for 7 days
- [ ] Submit works
- [ ] Success animation

### Admin

- [ ] Statistics accurate
- [ ] Filters work
- [ ] Pagination works
- [ ] Response modal opens
- [ ] Submit response updates status
- [ ] Archive/delete works

---

**Version:** 1.0.0  
**Created:** 2025-10-19  
**Author:** Development Team  
**License:** MIT

---

## 🎉 Happy Coding!

Hệ thống feedback đã hoàn thiện và sẵn sàng sử dụng. Đừng quên cập nhật authentication và test kỹ trước khi deploy production! 🚀

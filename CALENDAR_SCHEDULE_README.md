# Calendar Schedule Component - Hướng dẫn sử dụng

## Tổng quan

Component `CalendarSchedule` là một lịch học hiện đại với giao diện tháng (month view) và danh sách sự kiện sắp tới. Component này được thiết kế để sử dụng cho cả User (học viên) và Mentor.

## Cấu trúc File

```
src/
├── components/
│   └── user/
│       └── CalendarSchedule.jsx      # Component chính
├── pages/
│   └── user/
│       ├── UserSchedule.jsx          # Trang lịch cho User
│       └── MentorSchedule.jsx        # Trang lịch cho Mentor
```

## Sử dụng

### Cho User (Học viên)

```jsx
import UserSchedule from "./pages/user/UserSchedule";

<UserSchedule userId={currentUser.id} />;
```

### Cho Mentor

```jsx
import MentorSchedule from "./pages/user/MentorSchedule";

<MentorSchedule userId={currentUser.id} isOwner={true} />;
```

## Props

### CalendarSchedule Component

| Prop       | Type          | Mô tả                              | Mặc định  |
| ---------- | ------------- | ---------------------------------- | --------- |
| `userId`   | string/number | ID của user                        | -         |
| `userType` | string        | Loại user: "student" hoặc "mentor" | "student" |

## Tính năng

### 1. Calendar View

- ✅ Hiển thị lịch theo tháng
- ✅ Điều hướng tháng trước/sau
- ✅ Nút "Hôm nay" để quay về ngày hiện tại
- ✅ Đánh dấu ngày hiện tại
- ✅ Hiển thị sự kiện trên từng ngày
- ✅ Chuyển đổi view: Tháng/Tuần/Ngày (UI ready)

### 2. Events Sidebar

- ✅ Danh sách sự kiện sắp tới
- ✅ Thông tin chi tiết: tiêu đề, ngày, giờ, mentor
- ✅ Tags phân loại: Nghỉ lễ, Hệ thống, Đã xác nhận, Chờ xác nhận

### 3. Event Types

- **Holiday**: Ngày lễ, nghỉ (màu đỏ)
- **Class**: Buổi học (màu xanh dương)
- **Pending**: Chờ xác nhận (màu cam)

### 4. Khác biệt User vs Mentor

- **Mentor**: Có nút "Thêm sự kiện" để tạo lịch mới
- **User**: Chỉ xem lịch

## Tích hợp API

### 1. Lấy danh sách sự kiện

Thay đổi trong `CalendarSchedule.jsx` tại `useEffect`:

```jsx
useEffect(() => {
  const fetchEvents = async () => {
    try {
      // API endpoint cho user
      const endpoint =
        userType === "mentor"
          ? `/api/schedules/mentor/${userId}`
          : `/api/schedules/student/${userId}`;

      const response = await axiosClient.get(endpoint);

      // Transform API data to component format
      const transformedEvents = response.data.map((event) => ({
        id: event.id,
        title: event.title || event.subject,
        date: new Date(event.date),
        time: event.time,
        mentor: event.mentorName || event.instructor,
        type: event.type, // "class", "holiday", etc.
        tags: event.tags || [],
        color: getEventColor(event.type, event.status),
      }));

      setEvents(transformedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      message.error("Không thể tải lịch học");
    }
  };

  if (userId) {
    fetchEvents();
  }
}, [userId, userType]);
```

### 2. API Response Format (Expected)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Buổi học Tiếng Anh Giao Tiếp",
      "subject": "English Conversation",
      "date": "2025-10-15T00:00:00Z",
      "time": "14:00 - 15:30",
      "mentorName": "John Smith",
      "type": "class",
      "status": "confirmed",
      "tags": ["Đã xác nhận"]
    },
    {
      "id": 2,
      "title": "Lễ cúng Thần Tài",
      "date": "2025-10-06T00:00:00Z",
      "type": "holiday",
      "tags": ["Nghỉ lễ", "Hệ thống"]
    }
  ]
}
```

### 3. Thêm sự kiện mới (Mentor only)

Thêm hàm handler trong `CalendarSchedule.jsx`:

```jsx
const handleAddEvent = async () => {
  // Mở modal hoặc form để tạo sự kiện
  // Sau khi submit:
  try {
    const newEvent = {
      title: "Buổi học mới",
      date: selectedDate,
      time: "14:00 - 15:30",
      type: "class",
      // ... other fields
    };

    const response = await axiosClient.post("/api/schedules", newEvent);

    if (response.data.success) {
      message.success("Đã thêm sự kiện mới");
      // Refresh events
      fetchEvents();
    }
  } catch (error) {
    message.error("Không thể thêm sự kiện");
  }
};
```

### 4. Cập nhật sự kiện

```jsx
const handleUpdateEvent = async (eventId, updates) => {
  try {
    const response = await axiosClient.put(
      `/api/schedules/${eventId}`,
      updates
    );
    if (response.data.success) {
      message.success("Đã cập nhật sự kiện");
      fetchEvents();
    }
  } catch (error) {
    message.error("Không thể cập nhật sự kiện");
  }
};
```

### 5. Xóa sự kiện

```jsx
const handleDeleteEvent = async (eventId) => {
  try {
    const response = await axiosClient.delete(`/api/schedules/${eventId}`);
    if (response.data.success) {
      message.success("Đã xóa sự kiện");
      fetchEvents();
    }
  } catch (error) {
    message.error("Không thể xóa sự kiện");
  }
};
```

## Customization

### Thay đổi màu sắc

Trong `CalendarSchedule.jsx`, tìm và chỉnh sửa:

```jsx
const getEventColor = (type, status) => {
  if (type === "holiday") return "red";
  if (status === "confirmed") return "blue";
  if (status === "pending") return "orange";
  return "gray";
};
```

### Thêm loại sự kiện mới

1. Thêm vào `event types`
2. Cập nhật `getEventColor()`
3. Thêm style cho tag trong JSX

## Dependencies

- React
- lucide-react (icons)
- Tailwind CSS
- antd (message notifications - optional)

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

## Notes

- Component sử dụng mock data mặc định, cần thay bằng API calls thực tế
- Responsive design: hoạt động tốt trên desktop, tablet và mobile
- View Week và Day đã có UI button nhưng chưa implement logic
- Có thể extend để thêm filter, search, export calendar, v.v.

# Meeting Room với Agora Integration

## Mô tả

Ứng dụng React kết nối với Node.js backend để tạo và tham gia video call bằng Agora.io SDK.

## Cấu trúc dự án

### Frontend Components

- `MeetingLobby`: Trang chính để tạo và xem danh sách phòng
- `CreateRoomModal`: Modal tạo phòng mới
- `MeetingPage`: Trang video call chính
- `VideoSection`: Hiển thị video local và remote
- `MeetingControls`: Điều khiển camera, mic, rời phòng
- `Participants`: Danh sách người tham gia
- `MeetingHeader`: Header hiển thị thông tin phòng

### Services

- `apiService.js`: Kết nối với backend API
- `useAgora.js`: React hook quản lý Agora SDK

## Cài đặt và chạy

### 1. Backend Setup

```bash
cd Room
npm install
npm start
```

Backend sẽ chạy trên: http://localhost:4000

### 2. Frontend Setup

```bash
cd GSS/global-skill-swap
npm install

# Tạo file .env từ .env.example
cp .env.example .env

# Chỉnh sửa .env với thông tin thực tế
# VITE_API_URL=http://localhost:4000/api
# VITE_AGORA_APP_ID=your_agora_app_id

npm run dev
```

Frontend sẽ chạy trên: http://localhost:5173

### 3. Cấu hình Agora

1. Đăng ký tài khoản tại https://agora.io
2. Tạo project mới và lấy App ID
3. Cập nhật VITE_AGORA_APP_ID trong file .env

## Luồng sử dụng

### 1. Tạo phòng meeting

- Vào trang `/meeting-lobby`
- Click "Tạo Phòng Mới"
- Điền thông tin: tên người dùng, tên phòng
- Copy link meeting được tạo

### 2. Tham gia phòng

- Truy cập link meeting hoặc chọn phòng từ danh sách
- Nhập tên người dùng
- Tự động kết nối video call

### 3. Trong phòng meeting

- Bật/tắt camera và mic
- Xem danh sách người tham gia
- Chat với nhau (nếu implement)
- Rời khỏi phòng

## API Endpoints

### Meeting Rooms

- `GET /api/meetingrooms` - Lấy danh sách phòng
- `POST /api/meetingrooms` - Tạo phòng mới
- `GET /api/meetingrooms/:id` - Lấy thông tin phòng
- `PUT /api/meetingrooms/:id` - Cập nhật phòng
- `DELETE /api/meetingrooms/:id` - Xóa phòng

### Agora Integration

- `POST /api/meetingrooms/:id/join` - Join phòng và lấy token
- `POST /api/meetingrooms/:id/leave` - Rời phòng
- `GET /api/meetingrooms/:id/participants` - Lấy danh sách người tham gia
- `POST /api/meetingrooms/:id/tokens` - Tạo Agora tokens

## Database Schema

### meetingroom table

- id, room_name, mentor_id, user_id
- start_time, actual_start_time, status

### room_participants table

- id, room_id, uid, display_name
- joined_at, left_at, is_active

## Tech Stack

### Frontend

- React 18
- React Router
- Ant Design
- Tailwind CSS
- Agora RTC SDK
- Vite

### Backend

- Node.js
- Express
- Sequelize ORM
- MySQL
- Agora SDK
- Swagger docs

## Troubleshooting

### Backend không khởi động

1. Kiểm tra MySQL đã chạy
2. Kiểm tra config database trong `src/config/db.js`
3. Chạy migration: `node scripts/migrate.js`

### Agora connection failed

1. Kiểm tra App ID trong .env
2. Kiểm tra network firewall
3. Kiểm tra browser permissions cho camera/mic

### API calls failed

1. Kiểm tra backend đang chạy
2. Kiểm tra CORS settings
3. Kiểm tra API_URL trong .env

## URLs quan trọng

- Frontend: http://localhost:5173
- Meeting Lobby: http://localhost:5173/meeting-lobby
- API Docs: http://localhost:4000/api-docs
- Backend Health: http://localhost:4000/api/meetingrooms

## Demo Links

- Test Meeting: http://localhost:5173/meeting/1?userName=TestUser
- API Test: http://localhost:4000/meeting-room-integrated.html

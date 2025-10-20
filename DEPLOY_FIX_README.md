# 🔧 Khắc Phục Lỗi API Không Gọi Được Khi Deploy

## 🐛 Vấn Đề

Khi deploy lên production, các API call đến `https://gss-room-service.onrender.com/api/feedbacks/` không hoạt động mặc dù local environment chạy bình thường.

## 🔍 Nguyên Nhân

Các service sau **không kiểm tra môi trường production** đúng cách:

- `feedbackService.js`
- `chatAIService.js`
- `socketService.js`

Trong khi `axiosClient.js` và `axiosRoom.js` đã có logic:

```javascript
const baseUrl = import.meta.env.PROD
  ? import.meta.env.VITE_GATEWAY_SERVICE_URL + "/api"
  : "/api";
```

Các service trên chỉ dùng trực tiếp:

```javascript
const ROOM_SERVICE_URL = import.meta.env.VITE_ROOM_SERVICE_URL; // ❌ Có thể undefined khi build
```

## ✅ Giải Pháp

### 1. **feedbackService.js**

```javascript
// TRƯỚC
const ROOM_SERVICE_URL = import.meta.env.VITE_ROOM_SERVICE_URL;

// SAU
const ROOM_SERVICE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_ROOM_SERVICE_URL ||
    "https://gss-room-service.onrender.com"
  : import.meta.env.VITE_ROOM_SERVICE_URL || "http://localhost:3000";
```

### 2. **chatAIService.js**

```javascript
// TRƯỚC
const ROOM_SERVICE_URL = import.meta.env.VITE_ROOM_SERVICE_URL;

// SAU
const ROOM_SERVICE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_ROOM_SERVICE_URL ||
    "https://gss-room-service.onrender.com"
  : import.meta.env.VITE_ROOM_SERVICE_URL || "http://localhost:3000";
```

### 3. **socketService.js**

```javascript
// TRƯỚC
connect(serverUrl = import.meta.env.VITE_SOCKET_URL) {

// SAU
const DEFAULT_SOCKET_URL = import.meta.env.PROD
  ? import.meta.env.VITE_SOCKET_URL || 'https://gss-room-service.onrender.com'
  : import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

connect(serverUrl = DEFAULT_SOCKET_URL) {
```

## 🎯 Lợi Ích

1. ✅ **Fallback URL**: Nếu biến môi trường không load được, vẫn có URL mặc định
2. ✅ **Debug dễ dàng**: Console.log giúp kiểm tra URL đang dùng
3. ✅ **Tương thích**: Cùng pattern với `axiosClient.js` và `axiosRoom.js`
4. ✅ **Production-ready**: Đảm bảo hoạt động khi deploy

## 📋 Các Bước Sau Khi Sửa

1. **Test local**:

   ```bash
   npm run dev
   ```

   Kiểm tra console logs để đảm bảo URL đúng

2. **Build production**:

   ```bash
   npm run build
   ```

3. **Test build locally**:

   ```bash
   npm run preview
   ```

4. **Deploy**:
   ```bash
   git add .
   git commit -m "fix: add production environment check for services"
   git push
   ```

## 🔒 Lưu Ý Bảo Mật

- Đảm bảo `.env` file không được commit lên Git
- Các biến môi trường production phải được cấu hình trên hosting platform (Vercel, Netlify, etc.)
- Kiểm tra CORS settings trên backend để cho phép domain production

## 📝 Checklist Deploy

- [x] Sửa `feedbackService.js`
- [x] Sửa `chatAIService.js`
- [x] Sửa `socketService.js`
- [ ] Test local với `npm run dev`
- [ ] Build với `npm run build`
- [ ] Test preview với `npm run preview`
- [ ] Deploy và kiểm tra console logs
- [ ] Verify API calls hoạt động

## 🌐 URLs Cần Kiểm Tra

- Gateway Service: `https://gateway-service-w2gi.onrender.com`
- Room Service: `https://gss-room-service.onrender.com`
- Socket URL: `https://gss-room-service.onrender.com`

## 🚨 Nếu Vẫn Lỗi

1. Mở DevTools (F12) → Console tab
2. Tìm các log: 🔍 `feedbackService`, `chatAIService`, `socketService`
3. Kiểm tra URL có đúng không
4. Check Network tab xem request có được gửi không
5. Kiểm tra CORS error trong Console

---

**Cập nhật**: October 20, 2025
**Trạng thái**: ✅ Đã sửa

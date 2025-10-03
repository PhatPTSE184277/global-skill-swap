## 🔧 Chat Debug Checklist

### 1. Socket Connection Issues
- ✅ Socket URL đã được cập nhật từ localhost:3000 → https://gss-room-service.onrender.com
- ✅ Added logging để track connection status
- ✅ Added visual indicator (green/red dot) trong chat header

### 2. Kiểm tra trạng thái:
```javascript
// Mở Console (F12) và chạy:
console.log('Socket URL:', import.meta.env.VITE_SOCKET_URL);
console.log('Socket connected:', socketService.isConnected);
```

### 3. Các nguyên nhân có thể:
1. **Socket connection failed** → Input/Button bị disabled
2. **Environment variables không load** → Vẫn connect localhost
3. **CORS issues** → Backend từ chối connection
4. **Component state issues** → connected state không update

### 4. Quick fixes:
```javascript
// Force enable chat input (temporary):
// Trong ChatBox.jsx, comment out disabled prop:
<Input
  // disabled={!connected}  // Comment this line
  placeholder="Test chat..."
/>
```

### 5. Backend check:
- Xác nhận backend có support Socket.IO
- Check CORS settings cho frontend domain
- Verify Socket.IO events được handle đúng

### 6. Next steps:
1. Check console logs cho socket connection
2. Verify environment variables loading
3. Test manual socket connection
4. Check backend Socket.IO configuration
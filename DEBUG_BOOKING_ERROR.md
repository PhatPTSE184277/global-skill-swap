# 🔍 Debug Guide: Lỗi tạo Booking sau Thanh toán

## ❌ Lỗi hiện tại

```
Lỗi khi tạo booking:
Có lỗi xảy ra khi tạo booking. Vui lòng liên hệ hỗ trợ.
Transaction ID: SEVQRDH202510290817540524
```

## 🛠️ Các bước Debug

### Bước 1: Mở Console trong Browser

1. Nhấn `F12` hoặc `Ctrl+Shift+I`
2. Chuyển tab **Console**
3. Thực hiện lại flow thanh toán

### Bước 2: Kiểm tra Logs

Tìm các logs sau trong console:

#### A. PaymentSuccess Debug Info

```javascript
=== PaymentSuccess Debug Info ===
Transaction ID: ...
Payment Status: ...
Payment Type: lesson_booking  // ⚠️ Phải là "lesson_booking"
Has Booking Data: true         // ⚠️ Phải là true
Booking Data: { ... }          // ⚠️ Check cấu trúc
```

**Kiểm tra**:

- ✅ `Payment Type` = `"lesson_booking"`
- ✅ `Has Booking Data` = `true`
- ✅ `Booking Data` có đầy đủ `mentorId` và `timeslotId`

#### B. Booking Validation

```javascript
=== Booking Validation ===
bookingData exists: true
bookingData.mentorId: 123       // ⚠️ Phải có giá trị
bookingData.timeslotId: 456     // ⚠️ Phải có giá trị
Full bookingData: {
  "mentorId": 123,
  "timeslotId": 456,
  "timeslot": { ... },
  "amount": 200000
}
```

**Kiểm tra**:

- ✅ `mentorId` không phải `null`, `undefined`, `0`
- ✅ `timeslotId` không phải `null`, `undefined`, `0`

#### C. Creating Booking

```javascript
=== Creating Booking ===
API Booking Data: {
  "mentorId": 123,
  "timeslotId": 456
}
```

#### D. Error Details

```javascript
=== Error Creating Booking ===
Error object: { ... }
Error response: { ... }
Error response data: {
  "message": "...",      // ⚠️ Message lỗi từ backend
  "error": "...",
  "statusCode": 400/500
}
```

### Bước 3: Kiểm tra Network Tab

1. Mở tab **Network** trong DevTools
2. Filter: `XHR` hoặc `Fetch`
3. Tìm request `POST /booking`

**Kiểm tra**:

#### Request

```
Method: POST
URL: /booking
Headers:
  - Content-Type: application/json
  - Authorization: Bearer ...

Payload:
{
  "mentorId": 123,
  "timeslotId": 456
}
```

#### Response

- **Status Code**: `400`, `401`, `403`, `404`, `500`?
- **Response Body**: Message lỗi từ backend

### Bước 4: Các lỗi thường gặp

#### Lỗi 1: bookingData bị null/undefined

**Nguyên nhân**: Không truyền bookingData từ PaymentPage
**Giải pháp**: Check CalendarSchedule có navigate với đúng state không

```javascript
// CalendarSchedule.jsx - handleConfirmBooking
navigate("/payment", {
  state: {
    bookingData: {
      mentorId: userId,
      timeslotId: selectedTimeslot.slotData.id,
      // ...
    },
    productId: 2,
  },
});
```

#### Lỗi 2: mentorId hoặc timeslotId bị missing

**Nguyên nhân**:

- `userId` trong CalendarSchedule bị undefined
- `selectedTimeslot.slotData.id` bị undefined

**Giải pháp**: Check dữ liệu trước khi navigate

```javascript
console.log("userId:", userId);
console.log("timeslotId:", selectedTimeslot.slotData.id);
```

#### Lỗi 3: API trả về 401 Unauthorized

**Nguyên nhân**: Token hết hạn hoặc không có token

**Giải pháp**:

- Check localStorage có token không
- Login lại nếu cần

#### Lỗi 4: API trả về 400 Bad Request

**Nguyên nhân**: Backend không chấp nhận format request

**Giải pháp**: Check API docs của backend

- Có cần thêm field nào không?
- mentorId/timeslotId phải là number hay string?
- Có cần field khác như `studentId`, `bookingDate`?

#### Lỗi 5: API trả về 404 Not Found

**Nguyên nhân**:

- Endpoint sai
- mentorId hoặc timeslotId không tồn tại

**Giải pháp**:

- Check endpoint: `/booking` hay `/api/booking`?
- Verify mentor và timeslot có tồn tại trong DB không

#### Lỗi 6: API trả về 500 Internal Server Error

**Nguyên nhân**: Lỗi server backend

**Giải pháp**:

- Check backend logs
- Liên hệ backend team

### Bước 5: Test với Data giả

Thêm code test vào PaymentSuccess:

```javascript
// Test create booking with hardcoded data
const testCreateBooking = async () => {
  try {
    const testData = {
      mentorId: 1, // ID thật từ database
      timeslotId: 1, // ID thật từ database
    };

    console.log("Testing with:", testData);
    const response = await bookingService.createBooking(testData);
    console.log("Test response:", response);
  } catch (error) {
    console.error("Test error:", error);
  }
};

// Gọi để test
testCreateBooking();
```

## 📋 Checklist Debug

- [ ] Console có hiển thị logs không?
- [ ] `Payment Type` = `"lesson_booking"`?
- [ ] `bookingData` có giá trị?
- [ ] `mentorId` và `timeslotId` có giá trị hợp lệ?
- [ ] Network tab có request `POST /booking`?
- [ ] Status code là gì? (400, 401, 500?)
- [ ] Response body có message lỗi gì?
- [ ] Token còn hợp lệ không?
- [ ] Backend có hoạt động không?

## 🔧 Quick Fixes

### Fix 1: Kiểm tra structure của bookingData

```javascript
// Trong CalendarSchedule.jsx
const bookingData = {
  mentorId: userId, // ✅ Phải có
  timeslotId: selectedTimeslot.slotData.id, // ✅ Phải có
  timeslot: selectedTimeslot.slotData, // Optional
  mentor: { id: userId }, // Optional
  amount: 200000, // Optional
};

console.log("Before navigate - bookingData:", bookingData);
```

### Fix 2: Thêm fallback trong PaymentSuccess

```javascript
// Nếu bookingData không có mentorId/timeslotId trực tiếp
const mentorId = bookingData?.mentorId || bookingData?.mentor?.id;
const timeslotId = bookingData?.timeslotId || bookingData?.timeslot?.id;
```

### Fix 3: Retry logic

```javascript
// Thử lại nếu fail lần đầu
const createBookingWithRetry = async (maxRetries = 2) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await bookingService.createBooking(apiBookingData);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`Retry ${i + 1}/${maxRetries}...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};
```

## 📞 Liên hệ Support

Nếu vẫn gặp lỗi, gửi cho team:

1. Transaction ID: `SEVQRDH202510290817540524`
2. Console logs (screenshot hoặc copy text)
3. Network tab screenshot của request `/booking`
4. Thời gian xảy ra lỗi

## 🎯 Next Steps

1. Chạy lại flow và copy tất cả console logs
2. Paste logs vào đây để phân tích
3. Check Network tab và ghi lại status code + response
4. Kiểm tra backend API documentation
5. Test với data cứng (hardcoded mentorId và timeslotId)

# 🎉 Cập nhật: Tự động tạo Booking sau Thanh toán

## ✅ Vấn đề đã được giải quyết

**Vấn đề**: Sau khi thanh toán thành công, API `POST /booking` chưa được gọi để tạo booking.

**Giải pháp**: Đã thêm logic tự động gọi API tạo booking trong trang `PaymentSuccess.jsx` ngay sau khi thanh toán thành công.

---

## 📝 Các thay đổi mới trong PaymentSuccess.jsx

### 1. Import thêm services và components

```jsx
import { message } from "antd";
import bookingService from "../services/bookingService";
```

### 2. Thêm states để theo dõi trạng thái tạo booking

```jsx
const [isCreatingBooking, setIsCreatingBooking] = useState(false);
const [bookingCreated, setBookingCreated] = useState(false);
const [bookingError, setBookingError] = useState(null);
```

### 3. Thêm hàm `createBooking()`

```jsx
const createBooking = async () => {
  if (!bookingData || !bookingData.mentorId || !bookingData.timeslotId) {
    console.error("Missing booking data:", bookingData);
    setBookingError("Thiếu thông tin đặt lịch");
    return;
  }

  try {
    setIsCreatingBooking(true);
    setBookingError(null);

    // Prepare booking data for API
    const apiBookingData = {
      mentorId: bookingData.mentorId,
      timeslotId: bookingData.timeslotId,
    };

    console.log("Creating booking with data:", apiBookingData);
    const response = await bookingService.createBooking(apiBookingData);
    console.log("Booking created successfully:", response);

    if (response?.success) {
      setBookingCreated(true);
      message.success("Đặt lịch thành công!");
    }
  } catch (error) {
    console.error("Error creating booking after payment:", error);
    setBookingError(
      error.response?.data?.message ||
        "Có lỗi xảy ra khi tạo booking. Vui lòng liên hệ hỗ trợ."
    );
    message.error("Không thể tạo booking. Vui lòng liên hệ hỗ trợ.");
  } finally {
    setIsCreatingBooking(false);
  }
};
```

### 4. Gọi hàm tạo booking trong useEffect

```jsx
useEffect(() => {
  // ... existing validation code ...

  // Upload CV sau khi thanh toán thành công (chỉ cho mentor registration)
  if (finalPaymentType === "mentor_registration" && registrationData?.cv) {
    uploadCV();
  }

  // ⭐ MỚI: Tạo booking sau khi thanh toán thành công (chỉ cho lesson booking)
  if (finalPaymentType === "lesson_booking" && bookingData) {
    createBooking();
  }
}, [finalTransactionId, navigate, finalPaymentType, paymentStatus]);
```

### 5. Thêm UI hiển thị trạng thái booking

Đã thêm section mới trong giao diện:

```jsx
{
  /* Booking Status - for lesson booking */
}
{
  finalPaymentType === "lesson_booking" && (
    <div className="border-b border-gray-200 pb-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <FiCalendar className="mr-2 text-purple-600" />
        Trạng thái đặt lịch
      </h3>
      <div className="bg-gray-50 rounded-lg p-4">
        {/* Status indicators */}
        {isCreatingBooking && "Đang tạo booking..."}
        {bookingCreated && "Đã tạo booking thành công"}
        {bookingError && "Có lỗi xảy ra"}

        {/* Booking details */}
        {bookingData && (
          <div>
            - Mentor ID: {bookingData.mentorId}- Timeslot ID: {
              bookingData.timeslotId
            }- Ngày học: {bookingData.timeslot.slotDate}- Giờ học: {startTime} -{" "}
            {endTime}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 🔄 Luồng hoạt động hoàn chỉnh

```
1. Học viên chọn timeslot trên calendar
   ↓
2. Click "Đặt lịch" → Chuyển đến /payment với bookingData
   ↓
3. Trang thanh toán tạo invoice với productId = 2
   ↓
4. Hiển thị mã QR → Học viên thanh toán
   ↓
5. Thanh toán thành công → Chuyển đến /payment-success
   ↓
6. ⭐ TỰ ĐỘNG GỌI API POST /booking
   ├─ Loading: "Đang tạo booking..."
   ├─ Success: "Đã tạo booking thành công" ✅
   └─ Error: "Có lỗi xảy ra" + thông tin support
   ↓
7. Hiển thị thông tin booking và các bước tiếp theo
```

---

## 🎯 API Request Details

### Request được gửi đến backend

```http
POST /booking
Content-Type: application/json

{
  "mentorId": 123,
  "timeslotId": 456
}
```

### Response mong đợi

```json
{
  "success": true,
  "data": {
    "id": 789,
    "mentorId": 123,
    "timeslotId": 456,
    "bookingStatus": "PENDING",
    "createdAt": "2025-10-29T10:30:00"
  },
  "message": "Booking created successfully"
}
```

---

## ⚠️ Xử lý lỗi

### Lỗi 1: Thiếu dữ liệu booking

```
Điều kiện: !bookingData || !mentorId || !timeslotId
Hiển thị: "Thiếu thông tin đặt lịch"
Hành động: Không gọi API, hiển thị lỗi cho user
```

### Lỗi 2: API trả về error

```
Catch: error.response?.data?.message
Hiển thị: "Có lỗi xảy ra khi tạo booking. Vui lòng liên hệ hỗ trợ."
Bao gồm: transactionId để support tra cứu
```

### Lỗi 3: Network error

```
Catch: error.message
Hiển thị: Message lỗi từ antd
Log: Console error để debug
```

---

## 🧪 Testing Checklist

### ✅ Test Case 1: Happy Path

- [ ] Chọn timeslot và đặt lịch
- [ ] Thanh toán thành công
- [ ] Hiển thị "Đang tạo booking..."
- [ ] API được gọi với đúng data
- [ ] Hiển thị "Đã tạo booking thành công"
- [ ] Không có lỗi trong console

### ✅ Test Case 2: API Error

- [ ] Mock API trả về error 400/500
- [ ] Hiển thị message lỗi chi tiết
- [ ] Có transactionId để tra cứu
- [ ] User được hướng dẫn liên hệ support

### ✅ Test Case 3: Missing Data

- [ ] bookingData bị null/undefined
- [ ] Hiển thị "Thiếu thông tin đặt lịch"
- [ ] Không gọi API

### ✅ Test Case 4: Payment Failed

- [ ] Thanh toán thất bại
- [ ] Chuyển đến /payment-cancel
- [ ] KHÔNG gọi API tạo booking

---

## 📊 UI States

| State                     | Hiển thị                    | Icon    | Color |
| ------------------------- | --------------------------- | ------- | ----- |
| `isCreatingBooking: true` | "Đang tạo booking..."       | Spinner | Blue  |
| `bookingCreated: true`    | "Đã tạo booking thành công" | ✓ Check | Green |
| `bookingError: true`      | Thông báo lỗi + hướng dẫn   | ✗ X     | Red   |

---

## 🔍 Debug Tips

### Kiểm tra trong Console

```javascript
// Khi vào PaymentSuccess page
console.log("PaymentSuccess loaded:", {
  finalTransactionId,
  paymentStatus,
  finalPaymentType,
  hasBookingData: !!bookingData,
});

// Khi gọi API
console.log("Creating booking with data:", apiBookingData);

// Khi nhận response
console.log("Booking created successfully:", response);
```

### Kiểm tra Network Tab

1. Mở DevTools > Network
2. Filter: `XHR`
3. Tìm request `POST /booking`
4. Xem Request Payload và Response

### Kiểm tra State

Sử dụng React DevTools để xem:

- `isCreatingBooking`
- `bookingCreated`
- `bookingError`
- `bookingData`

---

## 📝 Notes

1. **Timing**: API được gọi ngay sau khi component mount và xác nhận thanh toán thành công
2. **Retry**: Hiện tại chưa có logic retry nếu API fail - cần thêm nếu cần thiết
3. **Notification**: Sử dụng `message.success()` và `message.error()` từ antd
4. **Data Validation**: Kiểm tra đầy đủ `mentorId` và `timeslotId` trước khi gọi API
5. **Error Handling**: Catch tất cả errors và hiển thị message user-friendly

---

## 🚀 Next Steps (Tùy chọn)

1. **Thêm retry logic**: Tự động retry nếu API call thất bại
2. **Thêm loading skeleton**: UI đẹp hơn khi đang tạo booking
3. **Email confirmation**: Gửi email xác nhận sau khi tạo booking
4. **Redirect**: Tự động chuyển đến trang calendar sau vài giây
5. **Analytics**: Track conversion rate từ payment → booking

---

## ✨ Summary

**Đã fix**: API `POST /booking` giờ được gọi tự động sau khi thanh toán thành công!

**Files đã sửa**:

- ✅ `src/pages/PaymentSuccess.jsx`

**Kết quả**:

- ✅ Booking được tạo tự động
- ✅ Hiển thị trạng thái real-time
- ✅ Xử lý lỗi tốt hơn
- ✅ UX được cải thiện

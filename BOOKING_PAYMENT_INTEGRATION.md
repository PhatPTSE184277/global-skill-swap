# Tích hợp Thanh toán cho Đặt lịch học

## Tổng quan

Đã tích hợp luồng thanh toán vào chức năng đặt lịch học. Khi học viên đặt lịch với mentor, họ sẽ được chuyển sang trang xác nhận thanh toán với `productId = 2`.

## Các thay đổi đã thực hiện

### 1. **CalendarSchedule.jsx** (`src/components/user/CalendarSchedule.jsx`)

#### Thêm import

```jsx
import { useNavigate } from "react-router-dom";
```

#### Thêm hook navigate

```jsx
const navigate = useNavigate();
```

#### Sửa đổi hàm `handleConfirmBooking`

- **Trước đây**: Gọi trực tiếp API `bookingService.createBooking()` để tạo booking
- **Bây giờ**: Chuyển hướng đến trang thanh toán với dữ liệu booking

```jsx
const handleConfirmBooking = async () => {
  if (!selectedTimeslot) return;

  try {
    setBookingLoading(true);

    // Chuẩn bị dữ liệu booking để truyền sang trang thanh toán
    const bookingData = {
      mentorId: userId, // ID của mentor
      timeslotId: selectedTimeslot.slotData.id, // ID của timeslot
      timeslot: selectedTimeslot.slotData, // Dữ liệu đầy đủ của timeslot
      mentor: {
        id: userId,
      },
      amount: 200000, // Số tiền mặc định
    };

    // Chuyển hướng đến trang thanh toán với productId = 2
    navigate("/payment", {
      state: {
        bookingData: bookingData,
        productId: 2, // Product ID cho việc đặt lịch học
      },
    });

    setIsBookingModalOpen(false);
    setSelectedTimeslot(null);
  } catch (error) {
    console.error("Error preparing booking:", error);
    message.error("Không thể chuẩn bị đặt lịch. Vui lòng thử lại!");
  } finally {
    setBookingLoading(false);
  }
};
```

### 2. **paymentService.js** (`src/services/paymentService.js`)

#### Cập nhật các hàm để hỗ trợ productId động

```javascript
// Tạo hóa đơn thanh toán với productId tùy chỉnh
createPayment: async (productId = "1") => {
  try {
    const response = await axiosClient.post("/invoice", {
      productId: productId.toString(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Tương tự cho processZaloPayPayment và processVNPayPayment
```

**Product IDs:**

- `"1"`: Upgrade user role (Đăng ký mentor) - 100,000 VNĐ
- `"2"`: Booking lessons (Đặt lịch học) - 200,000 VNĐ (hoặc giá tùy chỉnh)

### 3. **PaymentPage.jsx** (`src/pages/PaymentPage.jsx`)

#### Thêm useMemo cho productId

```jsx
const productId = useMemo(
  () => location.state?.productId || "1",
  [location.state?.productId]
);
```

#### Cập nhật điều kiện paymentType

```jsx
const paymentType = useMemo(() => {
  if (registrationData.fullName && registrationData.expertise) {
    return "mentor_registration";
  } else if (bookingData.mentorId || bookingData.timeslotId) {
    return "lesson_booking";
  }
  return "unknown";
}, [registrationData, bookingData]);
```

#### Truyền productId vào createPayment

```jsx
const response = await paymentService.createPayment(productId);
```

## Luồng hoạt động

1. **Học viên chọn timeslot**: Học viên xem lịch của mentor và click vào một timeslot còn trống
2. **Xác nhận đặt lịch**: Modal xác nhận hiện lên với thông tin timeslot
3. **Click "Đặt lịch"**: Hệ thống chuẩn bị dữ liệu booking và chuyển hướng đến `/payment`
4. **Trang thanh toán**:
   - Hiển thị thông tin đơn hàng với `productId = 2`
   - Tạo invoice tự động với số tiền 200,000 VNĐ (hoặc giá tùy chỉnh)
   - Hiển thị mã QR để thanh toán
5. **Sau khi thanh toán thành công**: Chuyển đến trang `/payment-success`
6. **Xử lý sau thanh toán**: Backend sẽ tự động tạo booking sau khi nhận được webhook thanh toán thành công

## Dữ liệu được truyền

### bookingData

```javascript
{
  mentorId: 123,              // ID của mentor
  timeslotId: 456,            // ID của timeslot
  timeslot: {                 // Dữ liệu đầy đủ của timeslot
    id: 456,
    slotDate: "2025-01-15",
    startTime: "14:00:00",
    endTime: "15:00:00",
    linkUrlRoom: "https://...",
    slotStatus: "AVAILABLE"
  },
  mentor: {
    id: 123
  },
  amount: 200000              // Số tiền thanh toán
}
```

### State được truyền qua navigate

```javascript
{
  bookingData: { ... },       // Dữ liệu booking như trên
  productId: 2                // Product ID cho booking
}
```

## Lưu ý

1. **Backend Integration**: Backend cần:

   - Lắng nghe webhook từ payment gateway
   - Tự động tạo booking sau khi thanh toán thành công
   - Trả về product với `id = 2` cho booking lessons

2. **Giá tiền**: Hiện tại set cứng là 200,000 VNĐ, có thể tùy chỉnh dựa trên:

   - Loại mentor
   - Thời lượng buổi học
   - Skill level

3. **Xử lý lỗi**: Nếu thanh toán thất bại, học viên được chuyển về `/payment-cancel`

4. **Refresh calendar**: Sau khi thanh toán thành công và booking được tạo, cần refresh calendar để cập nhật trạng thái timeslot

## Testing

1. Login với tài khoản học viên
2. Vào profile của một mentor
3. Xem calendar và chọn một timeslot còn trống
4. Click "Đặt lịch"
5. Verify: Chuyển đến trang `/payment` với thông tin chính xác
6. Verify: ProductId = 2 được sử dụng
7. Quét mã QR và hoàn tất thanh toán
8. Verify: Booking được tạo thành công sau khi thanh toán

## Các file liên quan

- `src/components/user/CalendarSchedule.jsx` - Component lịch học
- `src/services/paymentService.js` - Service xử lý thanh toán
- `src/pages/PaymentPage.jsx` - Trang thanh toán
- `src/pages/PaymentSuccess.jsx` - Trang thanh toán thành công
- `src/pages/PaymentCancel.jsx` - Trang thanh toán thất bại
- `src/routes/PaymentPageRoutes.jsx` - Routes cho thanh toán

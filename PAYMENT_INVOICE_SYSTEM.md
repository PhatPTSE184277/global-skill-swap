# Hệ thống thanh toán với Invoice API

## Tổng quan

Hệ thống thanh toán đã được tích hợp với **Invoice API** để quản lý hóa đơn và thanh toán một cách chuyên nghiệp.

## Luồng thanh toán mới

### 1. Tạo hóa đơn trước

```javascript
POST /api/invoice
{
  paymentType: 'mentor_registration' | 'lesson_booking',
  amount: 100000,
  orderId: 'ORDER_123',
  description: 'Thanh toán đăng ký mentor',
  paymentMethod: 'zalopay' | 'vnpay',
  registrationData: {...},
  bookingData: {...}
}
```

### 2. Xử lý thanh toán

```javascript
POST /api/payments/zalopay
{
  invoiceId: 'INV_123',
  amount: 100000,
  orderId: 'ORDER_123',
  redirectUrl: '/payment-success'
}
```

## Cấu trúc API

### Invoice Controller:

- `POST /invoice` - Tạo hóa đơn mới
- `GET /invoice/{id}` - Lấy thông tin hóa đơn

### Payment Controller:

- `POST /payments/zalopay` - Xử lý thanh toán ZaloPay
- `POST /payments/vnpay` - Xử lý thanh toán VNPay
- `POST /payments/verify` - Xác minh thanh toán
- `GET /payments/status/:orderId` - Trạng thái thanh toán

## PaymentService đã cập nhật

```javascript
// Xử lý thanh toán đơn giản với Invoice
processZaloPayPayment: async () => {
  // 1. Tạo hóa đơn và nhận paymentUrl trực tiếp
  const invoice = await axiosClient.post("/invoice", {
    productId: "1", // "Upgrade user role" - 100000 VND
  });

  // 2. Chuyển hướng đến paymentUrl từ response
  if (invoice.data.data && invoice.data.data.paymentUrl) {
    window.location.href = invoice.data.data.paymentUrl;
  }

  return invoice.data;
};
```

### Product ID:

- **Universal Product**: `"1"` - "Upgrade user role" (100,000 VND)
- Sử dụng cho tất cả loại thanh toán (mentor registration, lesson booking)

## Lợi ích của Invoice API

✅ **Traceability**: Theo dõi đầy đủ lịch sử giao dịch  
✅ **Audit Trail**: Lưu trữ tất cả thông tin hóa đơn  
✅ **Data Integrity**: Đảm bảo tính toàn vẹn dữ liệu  
✅ **Business Logic**: Tách biệt logic nghiệp vụ và thanh toán  
✅ **Reporting**: Dễ dàng tạo báo cáo tài chính

## Upload CV Integration

**CV sẽ được upload SAU khi thanh toán thành công:**

```javascript
// PaymentSuccess.jsx - useEffect()
useEffect(() => {
  // Upload CV sau khi thanh toán thành công (chỉ cho mentor registration)
  if (paymentType === "mentor_registration" && registrationData?.cv) {
    uploadCV();
  }
}, [transactionId, navigate, paymentType]);

const uploadCV = async () => {
  try {
    setIsUploadingCV(true);
    await userService.uploadCV(registrationData.cv);
    setCvUploadSuccess(true);
  } catch (error) {
    setCvUploadError("CV sẽ được xử lý trong vòng 24h.");
  } finally {
    setIsUploadingCV(false);
  }
};
```

## API Endpoints Summary

| Method | Endpoint            | Mô tả                 |
| ------ | ------------------- | --------------------- |
| `PUT`  | `/user/cvUpload`    | Upload CV file        |
| `POST` | `/invoice`          | Tạo hóa đơn           |
| `GET`  | `/invoice/{id}`     | Lấy thông tin hóa đơn |
| `POST` | `/payments/zalopay` | Thanh toán ZaloPay    |
| `POST` | `/payments/vnpay`   | Thanh toán VNPay      |

Hệ thống giờ đây hoàn toàn tích hợp với backend và sẵn sàng xử lý thanh toán thực tế! 🚀

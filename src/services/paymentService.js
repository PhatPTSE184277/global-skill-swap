import axiosClient from '../apis/axiosClient';

const paymentService = {
  // Tạo hóa đơn thanh toán
  createPayment: async (productId = "1", orderId = null) => {
    try {
      // Sử dụng product ID từ tham số hoặc mặc định là "1"
      const payload = {
        productId: productId.toString()  // "1" cho "Upgrade user role" - 100000 VND, "2" cho booking lessons
      };
      
      // Tạo URL với orderId nếu có (orderId = booking ID)
      let url = '/invoice';
      if (orderId) {
        url = `/invoice?orderId=${orderId}`;
      }
      
      const response = await axiosClient.post(url, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Xử lý thanh toán ZaloPay
  processZaloPayPayment: async (productId = "1") => {
    try {
      // Tạo hóa đơn và nhận paymentUrl trực tiếp
      const invoice = await axiosClient.post('/invoice', {
        productId: productId.toString()  // "1" cho "Upgrade user role", "2" cho booking
      });

      // Chuyển hướng đến paymentUrl từ invoice response
      if (invoice.data.data && invoice.data.data.paymentUrl) {
        window.location.href = invoice.data.data.paymentUrl;
      }

      return invoice.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Xử lý thanh toán VNPay
  processVNPayPayment: async (productId = "1") => {
    try {
      // Tạo hóa đơn và nhận paymentUrl trực tiếp
      const invoice = await axiosClient.post('/invoice', {
        productId: productId.toString()  // "1" cho "Upgrade user role", "2" cho booking
      });

      // Chuyển hướng đến paymentUrl từ invoice response
      if (invoice.data.data && invoice.data.data.paymentUrl) {
        window.location.href = invoice.data.data.paymentUrl;
      }

      return invoice.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Xác minh thanh toán
  verifyPayment: async (transactionId, paymentMethod) => {
    try {
      const response = await axiosClient.post('/payments/verify', {
        transactionId,
        paymentMethod
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy thông tin hóa đơn
  getInvoiceStatus: async (invoiceId) => {
    try {
      const response = await axiosClient.get(`/invoice/${invoiceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy thông tin thanh toán (backward compatibility)
  getPaymentStatus: async (orderId) => {
    try {
      const response = await axiosClient.get(`/payments/status/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Hủy thanh toán
  cancelPayment: async (orderId) => {
    try {
      const response = await axiosClient.post(`/payments/cancel/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Tạo hóa đơn
  generateReceipt: async (transactionId) => {
    try {
      const response = await axiosClient.get(`/payments/receipt/${transactionId}`, {
        responseType: 'blob'
      });

      // Tạo URL để download file PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${transactionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default paymentService;
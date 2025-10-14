import axiosClient from '../apis/axiosClient';

const paymentService = {
  // Tạo hóa đơn thanh toán
  createPayment: async () => {
    try {
      // Sử dụng product ID duy nhất từ hệ thống
      const response = await axiosClient.post('/invoice', {
        productId: "1"  // ID cho "Upgrade user role" - 100000 VND
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Xử lý thanh toán ZaloPay
  processZaloPayPayment: async () => {
    try {
      // Tạo hóa đơn và nhận paymentUrl trực tiếp
      const invoice = await axiosClient.post('/invoice', {
        productId: "1"  // "Upgrade user role" - 100000 VND
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
  processVNPayPayment: async () => {
    try {
      // Tạo hóa đơn và nhận paymentUrl trực tiếp
      const invoice = await axiosClient.post('/invoice', {
        productId: "1"  // "Upgrade user role" - 100000 VND
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
import axiosClient from '../apis/axiosClient';

const paymentService = {
  // Tạo đơn thanh toán
  createPayment: async (paymentData) => {
    try {
      const response = await axiosClient.post('/payments/create', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Xử lý thanh toán ZaloPay
  processZaloPayPayment: async (paymentData) => {
    try {
      const response = await axiosClient.post('/payments/zalopay', {
        amount: paymentData.amount,
        orderId: paymentData.orderId,
        description: `Thanh toán đăng ký mentor - ${paymentData.orderId}`,
        redirectUrl: `${window.location.origin}/mentor/payment-success`,
        registrationData: paymentData.registrationData
      });
      
      // Chuyển hướng đến ZaloPay
      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Xử lý thanh toán VNPay
  processVNPayPayment: async (paymentData) => {
    try {
      const response = await axiosClient.post('/payments/vnpay', {
        amount: paymentData.amount,
        orderId: paymentData.orderId,
        description: `Thanh toán đăng ký mentor - ${paymentData.orderId}`,
        returnUrl: `${window.location.origin}/mentor/payment-success`,
        registrationData: paymentData.registrationData
      });
      
      // Chuyển hướng đến VNPay
      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      }
      
      return response.data;
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

  // Lấy thông tin thanh toán
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
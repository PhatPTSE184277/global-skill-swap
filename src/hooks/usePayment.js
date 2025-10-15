import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import paymentService from '../services/paymentService';

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const processPayment = async (paymentData, onSuccess, onError) => {
    setIsProcessing(true);
    
    try {
      let result;
      
      // Xử lý thanh toán dựa trên phương thức
      if (paymentData.paymentMethod === 'zalopay') {
        result = await paymentService.processZaloPayPayment(paymentData);
      } else if (paymentData.paymentMethod === 'vnpay') {
        result = await paymentService.processVNPayPayment(paymentData);
      } else {
        throw new Error('Phương thức thanh toán không được hỗ trợ');
      }
      
      // Nếu có callback thành công
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
      
    } catch (error) {
      console.error('Payment processing error:', error);
      
      // Nếu có callback lỗi
      if (onError) {
        onError(error);
      } else {
        // Chuyển đến trang lỗi mặc định (sử dụng route chung)
        navigate('/payment-cancel', {
          search: `?error=PAYMENT_FAILED&message=${encodeURIComponent(error.message || 'Thanh toán thất bại')}&orderId=${paymentData.orderId}`
        });
      }
      
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyPayment = async (transactionId, paymentMethod) => {
    try {
      const result = await paymentService.verifyPayment(transactionId, paymentMethod);
      return result;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  };

  const getPaymentStatus = async (orderId) => {
    try {
      const result = await paymentService.getPaymentStatus(orderId);
      return result;
    } catch (error) {
      console.error('Get payment status error:', error);
      throw error;
    }
  };

  const cancelPayment = async (orderId) => {
    try {
      const result = await paymentService.cancelPayment(orderId);
      return result;
    } catch (error) {
      console.error('Cancel payment error:', error);
      throw error;
    }
  };

  const generateReceipt = async (transactionId) => {
    try {
      const result = await paymentService.generateReceipt(transactionId);
      return result;
    } catch (error) {
      console.error('Generate receipt error:', error);
      throw error;
    }
  };

  return {
    isProcessing,
    processPayment,
    verifyPayment,
    getPaymentStatus,
    cancelPayment,
    generateReceipt,
  };
};

export default usePayment;
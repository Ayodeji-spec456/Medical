import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { paymentService } from '../../services/paymentService';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const confirmPayment = async () => {
      const sessionId = searchParams.get('session_id');
      if (!sessionId) {
        toast.error('Invalid payment session');
        navigate('/');
        return;
      }

      try {
        await paymentService.confirmCheckout(sessionId);
        toast.success('Payment successful! Appointment confirmed.');
        navigate('/patient/dashboard');
      } catch (error) {
        toast.error('Payment confirmation failed');
        navigate('/');
      }
    };

    confirmPayment();
  }, [searchParams, navigate]);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Processing Payment...</h2>
      <p>Please wait while we confirm your payment.</p>
    </div>
  );
};

export default PaymentSuccess;

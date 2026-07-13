'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#fafafa',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '15px',
      '::placeholder': { color: '#52525b' },
      iconColor: '#818cf8',
    },
    invalid: { color: '#f87171', iconColor: '#f87171' },
  },
};

function CheckoutForm({ amount, expertId, locale }: { amount: number; expertId: string; locale: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);
    setError('');

    try {
      const token = document.cookie.split(';').find(c => c.trim().startsWith('jwt='))?.split('=')[1];

      // Create payment intent on backend
      const res = await fetch(`${API_URL}/payments/create-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ payeeId: expertId, amount }),
      });

      if (!res.ok) throw new Error('Failed to create payment intent');
      const { clientSecret } = await res.json();

      const card = elements.getElement(CardElement);
      if (!card) throw new Error('Card element not found');

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
      } else if (paymentIntent?.status === 'requires_capture') {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setPaying(false);
    }
  }

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fafafa' }}>Payment Held in Escrow!</h3>
        <p style={{ color: '#71717a', fontSize: '0.875rem', lineHeight: 1.6 }}>
          ${amount} is securely held. It will be released to your mentor after your session ends.
        </p>
        <a href={`/${locale}/appointments`} style={{ display: 'inline-block', marginTop: '1.5rem', textDecoration: 'none' }} className="btn-primary">
          View Appointments →
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#a1a1aa', marginBottom: '0.5rem' }}>Card Details</label>
        <div style={{ background: 'rgba(39,39,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.9rem 1rem', transition: 'all 0.2s' }}>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.75rem', padding: '0.875rem 1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '1rem', flexShrink: 0 }}>🔒</span>
        <div>
          <p style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600, marginBottom: '0.15rem' }}>Escrow Protected</p>
          <p style={{ fontSize: '0.75rem', color: '#71717a', lineHeight: 1.5 }}>
            Funds are held safely until your session completes. Use test card: 4242 4242 4242 4242.
          </p>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '0.75rem', padding: '0.75rem 1rem', color: '#f87171', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      <button type="submit" disabled={paying || !stripe} className="btn-primary" style={{ width: '100%', padding: '0.95rem', fontSize: '1rem' }}>
        {paying ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />
            Processing...
          </span>
        ) : `Pay $${amount} — Hold in Escrow 🔒`}
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#52525b' }}>
        Secured by Stripe · PCI DSS Compliant · SSL Encrypted
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}

export function PaymentForm({ amount, expertId, locale }: { amount: number; expertId: string; locale: string }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} expertId={expertId} locale={locale} />
    </Elements>
  );
}

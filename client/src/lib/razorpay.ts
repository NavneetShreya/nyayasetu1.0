export interface RazorpayOptions {
  key: string;
  amount: string;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

// Razorpay type definition
declare global {
  interface Window {
    Razorpay: any;
  }
}

/**
 * Loads the Razorpay script dynamically
 */
export const loadRazorpay = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      if (window.Razorpay) {
        resolve(window.Razorpay);
      } else {
        reject(new Error('Razorpay SDK failed to load'));
      }
    };
    script.onerror = () => {
      reject(new Error('Failed to load Razorpay SDK'));
    };
    
    document.body.appendChild(script);
  });
};

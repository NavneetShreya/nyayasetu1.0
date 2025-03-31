import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AdvocateWithDetails } from "@shared/schema";
import { loadRazorpay, RazorpayOptions } from "@/lib/razorpay";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ConnectModalProps {
  advocate: AdvocateWithDetails;
  onClose: () => void;
}

const ConnectModal = ({ advocate, onClose }: ConnectModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // Create order
      const orderResponse = await apiRequest("POST", "/api/payment/create-order", {
        advocateId: advocate.id,
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create payment order");
      }

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || "Payment initialization failed");
      }

      // Load Razorpay
      const razorpay = await loadRazorpay();

      // Calculate amount with GST
      const amount = orderData.data.amount;
      const currency = orderData.data.currency;
      const orderId = orderData.data.orderId;

      // Configure Razorpay
      const options: RazorpayOptions = {
        key: process.env.RAZORPAY_KEY_ID || "rzp_test_uGRnIeKCQMOXQk",
        amount: (amount * 100).toString(), // Amount in paise
        currency,
        name: "NyayaSetu",
        description: `Connect with Adv. ${advocate.user.fullName}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment with server
            const verifyResponse = await apiRequest("POST", "/api/payment/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              advocateId: advocate.id,
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              toast({
                title: "Payment Successful",
                description: "You're now connected with the advocate.",
              });
              onClose();
            } else {
              throw new Error(verifyData.message || "Payment verification failed");
            }
          } catch (error) {
            toast({
              title: "Payment Verification Failed",
              description: error instanceof Error ? error.message : "Please try again later",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: "Client Name",
          email: "client@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#ffd700", // Our gold primary color
        },
      };

      // Open Razorpay payment form
      const paymentObject = new razorpay(options);
      paymentObject.open();

    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-heading text-gray-900">Connect with Advocate</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <img 
              src={advocate.imageUrl} 
              alt={`Advocate ${advocate.user.fullName}`} 
              className="w-16 h-16 rounded-full object-cover mr-4" 
            />
            <div>
              <h4 className="font-medium text-gray-900">Adv. {advocate.user.fullName}</h4>
              <p className="text-gray-600 text-sm">
                {advocate.specialties.slice(0, 2).map(s => s.name).join(", ")}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Connection Fee</span>
              <span className="font-medium">₹10.00</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">GST (18%)</span>
              <span className="font-medium">₹1.80</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="font-medium">Total</span>
              <span className="font-bold">₹11.80</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            By paying this fee, you'll get access to the advocate's contact information and be able to communicate directly for the next 30 days.
          </p>
          <Button 
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full py-3 bg-primary text-black font-medium rounded-md hover:bg-[#e6c200] transition"
          >
            {isLoading ? "Processing..." : "Pay ₹11.80 with Razorpay"}
          </Button>
          <p className="text-center text-xs text-gray-500 mt-4">
            Secure payment powered by <span className="font-medium">Razorpay</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectModal;

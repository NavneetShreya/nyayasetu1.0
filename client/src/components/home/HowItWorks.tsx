import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Search for Advocates",
    description: "Enter your location and legal requirements to find qualified advocates in your area.",
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    number: 2,
    title: "Pay Minimal Fee",
    description: "Pay just ₹10 through our secure Razorpay gateway to connect with your chosen advocate.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    number: 3,
    title: "Connect & Consult",
    description: "Communicate directly with the advocate to discuss your legal matters and get the help you need.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-heading text-gray-900 mb-4">How NyayaSetu Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Getting legal help should be simple. Here's how our platform connects you with the right advocates.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-lg p-8 shadow-md relative z-10 h-full flex flex-col">
                <div className="flex items-center justify-center w-12 h-12 bg-primary text-black rounded-full text-xl font-bold mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold font-heading text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 flex-grow">{step.description}</p>
                <div className="mt-6">
                  <img src={step.image} alt={step.title} className="w-full h-48 object-cover rounded-md" />
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-0">
                  <ArrowRight className="text-3xl text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/advocates">
            <Button size="lg" className="bg-primary text-black font-medium hover:bg-[#e6c200] transition">
              Find an Advocate Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

import { useState, FormEvent } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon!",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-4">Contact Us</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions or feedback? We're here to help. Get in touch with our team.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-primary-100 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium font-heading mb-2">Email Us</h3>
              <p className="text-gray-600 mb-3">For general inquiries and support</p>
              <a href="mailto:support@nyayasetu.in" className="text-primary-500 font-medium hover:text-primary-600">
                support@nyayasetu.in
              </a>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-primary-100 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium font-heading mb-2">Call Us</h3>
              <p className="text-gray-600 mb-3">Mon-Fri, 9:00 AM - 6:00 PM</p>
              <a href="tel:+911234567890" className="text-primary-500 font-medium hover:text-primary-600">
                +91 123 456 7890
              </a>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-primary-100 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium font-heading mb-2">Visit Us</h3>
              <p className="text-gray-600 mb-3">Our headquarters</p>
              <span className="text-primary-500 font-medium">Bangalore, Karnataka, India</span>
            </div>
          </div>
          
          <div className="mt-12 bg-gray-50 p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold font-heading text-gray-900 mb-6">Send us a Message</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </Label>
                  <Input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </Label>
                  <Input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </Label>
                <Input 
                  type="text" 
                  id="subject" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </Label>
                <Textarea 
                  id="message" 
                  rows={4} 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Button 
                  type="submit" 
                  className="px-6 py-3 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

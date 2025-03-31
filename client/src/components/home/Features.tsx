import { 
  MapPin, 
  Zap, 
  Bot, 
  CheckCircle, 
  Star, 
  Lock
} from "lucide-react";

const featureItems = [
  {
    icon: <MapPin className="text-2xl text-secondary-500 group-hover:text-white transition" />,
    title: "Local Expertise",
    description: "Find advocates who understand your local laws, courts, and legal procedures for better representation.",
    hoverColor: "group-hover:bg-secondary-500"
  },
  {
    icon: <Zap className="text-2xl text-accent-600 group-hover:text-white transition" />,
    title: "Instant Connection",
    description: "Connect with advocates quickly with just a ₹10 fee, making legal consultation accessible to everyone.",
    hoverColor: "group-hover:bg-accent-600"
  },
  {
    icon: <Bot className="text-2xl text-blue-500 group-hover:text-white transition" />,
    title: "AI Legal Assistant",
    description: "Get instant answers about Indian laws and legal procedures from our AI chatbot, available 24/7.",
    hoverColor: "group-hover:bg-blue-500"
  },
  {
    icon: <CheckCircle className="text-2xl text-purple-500 group-hover:text-white transition" />,
    title: "Verified Advocates",
    description: "All advocates on our platform are verified professionals with their credentials and experience confirmed.",
    hoverColor: "group-hover:bg-purple-500"
  },
  {
    icon: <Star className="text-2xl text-red-500 group-hover:text-white transition" />,
    title: "Client Reviews",
    description: "Read authentic reviews from previous clients to help you choose the right advocate for your needs.",
    hoverColor: "group-hover:bg-red-500"
  },
  {
    icon: <Lock className="text-2xl text-green-500 group-hover:text-white transition" />,
    title: "Secure Platform",
    description: "Your information and communications are secured with end-to-end encryption for complete privacy.",
    hoverColor: "group-hover:bg-green-500"
  }
];

const Features = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-heading text-gray-900 mb-4">Why Choose NyayaSetu?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're building a platform that makes legal services more accessible, transparent, and efficient for everyone.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureItems.map((feature, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition group">
              <div className={`w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center mb-6 transition ${feature.hoverColor}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold font-heading text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

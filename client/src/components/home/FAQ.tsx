import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
};

const faqItems: FAQItem[] = [
  {
    question: "How do I find an advocate on NyayaSetu?",
    answer: "Finding an advocate on NyayaSetu is simple. Use the search functionality on our homepage or navigate to the \"Find Advocates\" section. You can filter advocates by location, specialization, experience, and ratings. Once you find an advocate suitable for your needs, click on their profile to view details and choose to connect with them."
  },
  {
    question: "Why do I have to pay ₹10 to connect with an advocate?",
    answer: "The ₹10 fee serves two purposes: it helps filter genuine inquiries, ensuring advocates' time is respected, and it helps maintain our platform's quality. This minimal fee gives you direct access to the advocate's contact information, allowing you to discuss your case in detail and arrange consultations. The fee is one-time per advocate and provides 30 days of contact access."
  },
  {
    question: "How accurate is the AI legal assistant?",
    answer: "Our AI legal assistant is trained on Indian legal statutes and provides accurate general information about laws, sections, and basic procedures. However, it should not be considered a substitute for professional legal advice. The AI is designed to give preliminary information and help you understand basic legal concepts. For specific legal advice tailored to your situation, we recommend consulting with an advocate through our platform."
  },
  {
    question: "How are advocates verified on NyayaSetu?",
    answer: "All advocates on NyayaSetu go through a rigorous verification process. We verify their bar council registration number, practice license, educational credentials, and professional experience. We also conduct periodic reviews and monitor client feedback to ensure they maintain high standards of service. This verification process helps ensure that you connect with legitimate, qualified legal professionals."
  },
  {
    question: "What if I'm not satisfied with the advocate I connected with?",
    answer: "If you're not satisfied with the advocate you connected with, we encourage you to leave honest feedback on their profile to help other users. While the connection fee is non-refundable, you're always free to connect with other advocates who might better suit your needs. If you believe an advocate has engaged in unprofessional conduct, please contact our support team, and we'll investigate the matter."
  },
  {
    question: "Is my information secure on NyayaSetu?",
    answer: "Yes, we take data security very seriously. All communications on NyayaSetu are encrypted, and we follow industry-standard security practices to protect your personal information. We do not share your details with any third parties without your consent, except with the advocate you choose to connect with. Our privacy policy outlines in detail how we collect, use, and protect your information."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <section id="faq" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-heading text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about NyayaSetu and how our platform works.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  className="w-full flex justify-between items-center p-5 bg-gray-50 hover:bg-gray-100 transition text-left"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="font-medium font-heading">{item.question}</span>
                  <ChevronDown 
                    className={`text-primary-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                  />
                </button>
                <div className={`p-5 border-t border-gray-200 ${openIndex === index ? 'block' : 'hidden'}`}>
                  <p className="text-gray-600">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

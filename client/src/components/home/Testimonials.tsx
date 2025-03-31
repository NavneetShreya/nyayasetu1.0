import { Star, StarHalf } from "lucide-react";

type Testimonial = {
  content: string;
  rating: number;
  author: {
    name: string;
    location: string;
    image: string;
  };
};

const testimonials: Testimonial[] = [
  {
    content: "I was struggling to find a property lawyer in my area until I discovered NyayaSetu. Within minutes, I found and connected with an experienced advocate who helped resolve my property dispute.",
    rating: 5.0,
    author: {
      name: "Rajan Patel",
      location: "Pune, Maharashtra",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    }
  },
  {
    content: "The AI assistant on NyayaSetu helped me understand the basic legal requirements for my business registration. I then connected with a corporate lawyer who guided me through the entire process. Extremely helpful!",
    rating: 4.5,
    author: {
      name: "Meera Sharma",
      location: "Bangalore, Karnataka",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    }
  },
  {
    content: "As someone facing a legal issue for the first time, I was anxious about finding the right advocate. NyayaSetu made it simple. I could see ratings, specializations, and experience before connecting. The advocate I found was excellent.",
    rating: 5.0,
    author: {
      name: "Ahmed Khan",
      location: "Delhi, NCR",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    }
  }
];

const RatingStars = ({ rating }: { rating: number }) => {
  // Generate an array of 5 stars, either full or half based on the rating
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`full-${i}`} className="fill-yellow-500 text-yellow-500" />);
  }
  
  if (hasHalfStar) {
    stars.push(<StarHalf key="half" className="fill-yellow-500 text-yellow-500" />);
  }
  
  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Star key={`empty-${i}`} className="text-yellow-500 opacity-40" />);
  }
  
  return <div className="flex">{stars}</div>;
};

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-heading text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from clients who have found the right legal support through NyayaSetu.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md relative">
              <div className="text-secondary-500 text-4xl absolute -top-5 left-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <div className="mb-6 pt-4">
                <div className="flex items-center mb-1">
                  <RatingStars rating={testimonial.rating} />
                  <span className="text-gray-500 text-sm ml-2">{testimonial.rating.toFixed(1)}</span>
                </div>
                <p className="text-gray-600 italic">
                  "{testimonial.content}"
                </p>
              </div>
              <div className="flex items-center mt-6">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img src={testimonial.author.image} alt={testimonial.author.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">{testimonial.author.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.author.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

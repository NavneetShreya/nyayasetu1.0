import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdvocateWithDetails, Review } from "@shared/schema";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Briefcase, 
  CheckCircle, 
  Star, 
  Calendar, 
  ChevronLeft,
  ExternalLink
} from "lucide-react";
import ConnectModal from "../payment/ConnectModal";

type AdvocateDetailProps = {
  advocateId: string;
};

const AdvocateDetail = ({ advocateId }: AdvocateDetailProps) => {
  const [showConnectModal, setShowConnectModal] = useState(false);

  const { data, isLoading, error } = useQuery<{ 
    success: boolean; 
    data: AdvocateWithDetails & { reviews: Review[] }; 
  }>({
    queryKey: [`/api/advocates/${advocateId}`],
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading advocate details...</p>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error loading advocate details.</p>
        <Link href="/advocates">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Advocates
          </Button>
        </Link>
      </div>
    );
  }

  const advocate = data.data;
  const reviews = advocate.reviews || [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/advocates">
          <Button variant="outline" className="mb-4">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Advocates
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Profile */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-64 overflow-hidden">
              <img 
                src={advocate.imageUrl} 
                alt={`Advocate ${advocate.user.fullName}`} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold font-heading text-gray-900">
                  Adv. {advocate.user.fullName}
                </h1>
                {advocate.verified && (
                  <span className="text-green-500 flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" /> Verified
                  </span>
                )}
              </div>

              <div className="flex items-center mb-4">
                <Star className="text-yellow-500 h-5 w-5 fill-yellow-500" />
                <span className="text-lg font-semibold ml-2">
                  {advocate.rating.toFixed(1)}
                </span>
                <span className="text-gray-500 ml-1">
                  ({advocate.reviewCount} reviews)
                </span>
              </div>

              <div className="space-y-3 text-gray-600">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-0.5 text-gray-400" />
                  <span>
                    {advocate.location.city}, {advocate.location.state}
                    {advocate.location.pincode && ` - ${advocate.location.pincode}`}
                  </span>
                </div>
                <div className="flex items-start">
                  <Briefcase className="h-5 w-5 mr-3 mt-0.5 text-gray-400" />
                  <span>{advocate.experience} years of experience</span>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 mt-0.5 text-gray-400" />
                  <span>Bar Council: {advocate.barCouncilNumber}</span>
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  className="w-full bg-primary text-black hover:bg-[#e6c200] transition font-medium"
                  onClick={() => setShowConnectModal(true)}
                >
                  Connect for ₹10
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold font-heading mb-4 text-gray-900">
              About
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {advocate.bio}
            </p>

            <h3 className="text-lg font-bold font-heading mb-3 text-gray-900">
              Specializations
            </h3>
            <div className="flex flex-wrap mb-6">
              {advocate.specialties.map((specialty, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="mr-2 mb-2 bg-black text-primary hover:bg-gray-900"
                >
                  {specialty.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold font-heading mb-4 text-gray-900">
              Client Reviews
            </h2>

            {reviews.length === 0 ? (
              <p className="text-gray-500 italic">No reviews yet. Be the first to leave a review after connecting.</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <div key={index} className={`${index > 0 ? 'pt-6 border-t border-gray-200' : ''}`}>
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                          <span className="font-medium">
                            {/* Get initials from the review author */}
                            {review.userId.toString().substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Client {review.userId}</span>
                          <div className="flex mt-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            ))}
                            {[...Array(5 - review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-gray-300" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">
                      {review.content || "Great experience working with this advocate."}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showConnectModal && (
        <ConnectModal advocate={advocate} onClose={() => setShowConnectModal(false)} />
      )}
    </div>
  );
};

export default AdvocateDetail;

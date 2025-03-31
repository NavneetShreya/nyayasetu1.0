import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Star } from "lucide-react";
import { AdvocateWithDetails } from "@shared/schema";
import { useState } from "react";
import ConnectModal from "../payment/ConnectModal";

type AdvocateCardProps = {
  advocate: AdvocateWithDetails;
};

const AdvocateCard = ({ advocate }: AdvocateCardProps) => {
  const [showConnectModal, setShowConnectModal] = useState(false);
  
  const handleConnectClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConnectModal(true);
  };
  
  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
        <Link href={`/advocate/${advocate.id}`} className="block">
          <div className="h-48 overflow-hidden">
            <img 
              src={advocate.imageUrl} 
              alt={`Advocate ${advocate.user.fullName}`} 
              className="w-full h-full object-cover object-center hover:scale-105 transition duration-300" 
            />
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold font-heading text-gray-900 mb-1">
                  Adv. {advocate.user.fullName}
                </h3>
                <p className="text-gray-600 text-sm">
                  <MapPin className="inline-block h-4 w-4 mr-1 text-secondary-500" />
                  {advocate.location.city}, {advocate.location.state}
                </p>
              </div>
              <div className="flex items-center">
                <Star className="text-yellow-500 mr-1 h-4 w-4 fill-yellow-500" />
                <span className="font-medium">{advocate.rating.toFixed(1)}</span>
                <span className="text-gray-500 text-sm ml-1">({advocate.reviewCount})</span>
              </div>
            </div>
            <div className="mb-4">
              {advocate.specialties.slice(0, 3).map((specialty, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="mr-1 mb-1 bg-black text-primary hover:bg-gray-900"
                >
                  {specialty.name}
                </Badge>
              ))}
            </div>
            <div className="mb-4">
              <p className="text-gray-600 text-sm line-clamp-2">
                {advocate.bio}
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div>
                <span className="text-sm text-gray-500">
                  <Briefcase className="inline-block h-4 w-4 mr-1" />
                  {advocate.experience} {advocate.experience === 1 ? 'year' : 'years'}
                </span>
              </div>
              <Button 
                size="sm" 
                className="px-4 py-1.5 bg-primary text-black text-sm font-medium rounded hover:bg-[#e6c200] transition"
                onClick={handleConnectClick}
              >
                Connect for ₹10
              </Button>
            </div>
          </div>
        </Link>
      </div>
      
      {showConnectModal && (
        <ConnectModal 
          advocate={advocate} 
          onClose={() => setShowConnectModal(false)} 
        />
      )}
    </>
  );
};

export default AdvocateCard;

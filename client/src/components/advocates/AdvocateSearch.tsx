import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  MapPin,
  Search,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PracticeArea = {
  id: number;
  name: string;
};

type Location = {
  id: number;
  city: string;
  state: string;
  pincode?: string;
};

type AdvocateSearchProps = {
  initialLocation?: string;
  initialPracticeArea?: string;
  initialExperience?: string;
  initialQuery?: string;
  onFilter: (filters: {
    location: string;
    practiceArea: string;
    experience: string;
    query: string;
  }) => void;
};

const AdvocateSearch = ({
  initialLocation = "",
  initialPracticeArea = "",
  initialExperience = "",
  initialQuery = "",
  onFilter
}: AdvocateSearchProps) => {
  const [location, setLocation] = useState(initialLocation);
  const [practiceArea, setPracticeArea] = useState(initialPracticeArea);
  const [experience, setExperience] = useState(initialExperience);
  const [query, setQuery] = useState(initialQuery);
  
  const [, setLocationPath] = useLocation();
  
  const { data: practiceAreas } = useQuery<{ success: boolean; data: PracticeArea[] }>({
    queryKey: ['/api/practice-areas'],
  });
  
  const handleFilter = () => {
    onFilter({
      location,
      practiceArea,
      experience,
      query
    });
    
    // Update URL with search parameters
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (practiceArea) params.append("practiceArea", practiceArea);
    if (experience) params.append("experience", experience);
    if (query) params.append("query", query);
    
    const queryString = params.toString();
    setLocationPath(`/advocates${queryString ? `?${queryString}` : ''}`);
  };
  
  return (
    <div className="mb-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-gray-50 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-grow mb-4 sm:mb-0">
        <div className="flex-grow">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input 
              type="text" 
              placeholder="Search by name, specialty, or location" 
              className="pl-10 w-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="sm:w-48">
          <Select value={practiceArea} onValueChange={setPracticeArea}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Specialties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              {practiceAreas?.data?.map((area) => (
                <SelectItem key={area.id} value={area.name}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:w-48">
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              <SelectItem value="Delhi">Delhi</SelectItem>
              <SelectItem value="Mumbai">Mumbai</SelectItem>
              <SelectItem value="Bangalore">Bangalore</SelectItem>
              <SelectItem value="Chennai">Chennai</SelectItem>
              <SelectItem value="Kolkata">Kolkata</SelectItem>
              <SelectItem value="Hyderabad">Hyderabad</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="sm:w-48">
          <Select value={experience} onValueChange={setExperience}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Any Experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Experience</SelectItem>
              <SelectItem value="1-3">1-3 years</SelectItem>
              <SelectItem value="3-5">3-5 years</SelectItem>
              <SelectItem value="5-10">5-10 years</SelectItem>
              <SelectItem value="10+">10+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button 
        onClick={handleFilter}
        className="px-6 py-2 bg-accent-600 text-white font-medium rounded-md hover:bg-accent-700 transition"
      >
        <Filter className="h-4 w-4 mr-2" /> Filter
      </Button>
    </div>
  );
};

export default AdvocateSearch;

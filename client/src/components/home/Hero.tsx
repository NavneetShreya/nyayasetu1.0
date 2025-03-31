import { Link } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Scale, Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Location = {
  id: number;
  city: string;
  state: string;
  pincode?: string;
};

type PracticeArea = {
  id: number;
  name: string;
};

const Hero = () => {
  const [location, setLocation] = useState("");
  const [practiceArea, setPracticeArea] = useState("");
  const [experience, setExperience] = useState("");
  
  const { data: practiceAreas, isLoading: practiceAreasLoading } = useQuery<{ success: boolean; data: PracticeArea[] }>({
    queryKey: ['/api/practice-areas'],
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build the query string with the search parameters
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (practiceArea) params.append('practiceArea', practiceArea);
    if (experience) params.append('experience', experience);
    
    // Navigate to the advocates page with the search parameters
    window.location.href = `/advocates?${params.toString()}`;
  };
  
  return (
    <section className="relative bg-primary-500 text-white overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="w-full h-full bg-primary-500" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 leading-tight">
              Find the Right Legal Expert <span className="text-secondary-400">Near You</span>
            </h1>
            <p className="text-lg mb-8 text-gray-100 max-w-lg">
              NyayaSetu connects you with experienced advocates in your area, making legal help accessible to everyone across India.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/advocates">
                <Button size="lg" className="bg-black hover:bg-gray-800 text-[#ffd700] font-bold border-2 border-[#ffd700] shadow-lg w-full sm:w-auto">
                  Find Advocates
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" className="bg-[#ffd700] hover:bg-[#e6c200] text-black font-bold border-2 border-black w-full sm:w-auto">
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative rounded-lg overflow-hidden shadow-2xl">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-primary-500 font-heading font-bold text-xl mb-4">Quick Advocate Search</h3>
              <form className="space-y-4" onSubmit={handleSearch}>
                <div>
                  <Label htmlFor="location" className="text-gray-700 mb-1">Location</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      id="location"
                      type="text" 
                      placeholder="City, State or PIN code" 
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="practiceArea" className="text-gray-700 mb-1">Practice Area</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <Scale className="h-5 w-5 text-gray-400" />
                    </div>
                    <Select value={practiceArea} onValueChange={setPracticeArea}>
                      <SelectTrigger className="pl-10 w-full border border-gray-300 rounded-md text-left h-10">
                        <SelectValue placeholder="All Practice Areas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Practice Areas</SelectItem>
                        {!practiceAreasLoading && practiceAreas?.data?.map((area) => (
                          <SelectItem key={area.id} value={area.name}>
                            {area.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="experience" className="text-gray-700 mb-1">Experience</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Select value={experience} onValueChange={setExperience}>
                      <SelectTrigger className="pl-10 w-full border border-gray-300 rounded-md text-left h-10">
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
                  type="submit" 
                  className="w-full py-3 bg-black hover:bg-gray-800 text-[#ffd700] font-bold border-2 border-[#ffd700] rounded-md transition"
                >
                  Search Now
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-primary-600 to-transparent"></div>
    </section>
  );
};

export default Hero;

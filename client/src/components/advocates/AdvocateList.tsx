import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdvocateWithDetails } from "@shared/schema";
import AdvocateCard from "./AdvocateCard";
import AdvocateSearch from "./AdvocateSearch";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useLocation } from "wouter";

const AdvocateList = () => {
  const [location] = useLocation();
  
  // Parse URL parameters
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const initialLocation = searchParams.get('location') || '';
  const initialPracticeArea = searchParams.get('practiceArea') || '';
  const initialExperience = searchParams.get('experience') || '';
  const initialQuery = searchParams.get('query') || '';
  
  // Create filter state
  const [filters, setFilters] = useState({
    location: initialLocation,
    practiceArea: initialPracticeArea,
    experience: initialExperience,
    query: initialQuery
  });
  
  // State for showing "load more"
  const [visibleItems, setVisibleItems] = useState(6);
  
  // Query parameters based on filters
  const queryParams = new URLSearchParams();
  if (filters.location) queryParams.append('location', filters.location);
  if (filters.practiceArea) queryParams.append('practiceArea', filters.practiceArea);
  if (filters.experience) queryParams.append('experience', filters.experience);
  if (filters.query) queryParams.append('query', filters.query);
  
  const queryString = queryParams.toString();
  
  const { data, isLoading, error } = useQuery<{ success: boolean; data: AdvocateWithDetails[] }>({
    queryKey: [
      queryString ? `/api/advocates/search?${queryString}` : '/api/advocates'
    ],
  });
  
  const handleFilterChange = (newFilters: {
    location: string;
    practiceArea: string;
    experience: string;
    query: string;
  }) => {
    setFilters(newFilters);
    setVisibleItems(6); // Reset visible items when filters change
  };
  
  const loadMore = () => {
    setVisibleItems(prev => prev + 6);
  };
  
  const advocates = data?.data || [];
  const hasMore = advocates.length > visibleItems;
  
  return (
    <div>
      <AdvocateSearch 
        initialLocation={initialLocation}
        initialPracticeArea={initialPracticeArea}
        initialExperience={initialExperience}
        initialQuery={initialQuery}
        onFilter={handleFilterChange}
      />
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading advocates...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>Error loading advocates. Please try again later.</p>
        </div>
      ) : advocates.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No advocates found matching your criteria. Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advocates.slice(0, visibleItems).map((advocate) => (
              <AdvocateCard key={advocate.id} advocate={advocate} />
            ))}
          </div>
          
          {hasMore && (
            <div className="mt-10 flex justify-center">
              <Button
                onClick={loadMore}
                variant="outline"
                className="px-6 py-3 bg-white border border-primary rounded-md text-black font-medium hover:bg-gray-50 transition"
              >
                Load More Advocates <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdvocateList;

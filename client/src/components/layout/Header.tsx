import { useState } from "react";
import { Link, useLocation } from "wouter";
import logoImage from "../../assets/logo.jpeg";
import { useAuth } from "@/hooks/use-auth";
import { 
  User, 
  LogOut, 
  UserPlus, 
  LogIn, 
  Menu,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout, isAuthenticated, isAdvocate, isClient } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
    { name: "Advocates", href: "/advocates" },
  ];

  return (
    <header className="bg-black text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="h-12 w-12 rounded-lg flex items-center justify-center overflow-hidden mr-3 bg-white p-1">
                <img src={logoImage} alt="NyayaSetu Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold font-heading text-primary">NyayaSetu</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                className={`text-white hover:text-primary font-medium ${
                  (location === link.href || 
                   (link.href !== "/" && location.startsWith(link.href))) ? 
                   "text-primary" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAdvocate() && (
              <Link 
                href="/advocate-dashboard" 
                className={`text-white hover:text-primary font-medium ${
                  location.startsWith('/advocate-dashboard') ? "text-primary" : ""
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center px-4 py-2 rounded-md text-white font-medium hover:text-primary focus:outline-none">
                  <User className="w-5 h-5 mr-2" />
                  {user?.fullName.split(' ')[0]}
                  <ChevronDown className="ml-1 w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white">
                  <DropdownMenuLabel>
                    <div className="text-gray-900">{user?.fullName}</div>
                    <div className="text-xs text-gray-500">@{user?.username}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdvocate() && (
                    <DropdownMenuItem>
                      <Link href="/advocate-dashboard" className="flex items-center w-full">
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Link href="/profile" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/signin" className="px-4 py-2 rounded-md text-white font-medium hover:text-primary flex items-center">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
                <Link href="/register" className="px-4 py-2 bg-black text-[#ffd700] rounded-md font-bold border-2 border-[#ffd700] hover:bg-gray-800 transition flex items-center">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-white hover:text-primary focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <div className={`md:hidden pb-4 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col space-y-2 bg-black border border-gray-800 rounded-lg p-2">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                className={`px-4 py-2 text-white hover:bg-gray-900 rounded-md ${
                  (location === link.href || 
                   (link.href !== "/" && location.startsWith(link.href))) ? 
                   "text-primary" : ""
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {isAdvocate() && (
              <Link 
                href="/advocate-dashboard" 
                className={`px-4 py-2 text-white hover:bg-gray-900 rounded-md ${
                  location.startsWith('/advocate-dashboard') ? "text-primary" : ""
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            
            {isAuthenticated ? (
              <div className="border-t border-gray-800 mt-2 pt-2">
                <div className="px-4 py-2 text-primary font-medium">
                  {user?.fullName}
                </div>
                
                <Link 
                  href="/profile" 
                  className="px-4 py-2 text-white hover:bg-gray-900 rounded-md flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-900 rounded-md flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-2 flex flex-col space-y-2 border-t border-gray-800 mt-2">
                <Link 
                  href="/signin" 
                  className="px-4 py-2 border border-gray-700 text-center rounded-md text-white font-medium hover:border-primary hover:text-primary flex items-center justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-2 bg-black text-center text-[#ffd700] rounded-md font-bold border-2 border-[#ffd700] hover:bg-gray-800 transition flex items-center justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

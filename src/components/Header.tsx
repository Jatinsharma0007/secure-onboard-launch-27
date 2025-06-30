
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { AvatarDropdown } from '@/components/AvatarDropdown';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Bookings', path: '/bookings' },
  { name: 'AI Coach', path: '/ai-coach' },
  { name: 'Spaces', path: '/spaces' },
  { name: 'Dashboard', path: '/dashboard', hideOnMobile: true },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <img src="/favicon.svg" alt="SPARC Logo" className="w-8 h-8 rounded-full" />
            <Link to="/" className="text-xl font-bold text-gray-900">
              SPARC
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                isActive={location.pathname === item.path}
                className={item.hideOnMobile ? 'hidden lg:block' : ''}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full"></div>
            ) : user ? (
              <AvatarDropdown />
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                !item.hideOnMobile && (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    isActive={location.pathname === item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-2"
                  >
                    {item.name}
                  </NavLink>
                )
              ))}
              
              {/* Mobile Auth Section */}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                {loading ? (
                  <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full mx-2"></div>
                ) : user ? (
                  <div className="px-2">
                    <AvatarDropdown />
                  </div>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button size="sm" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

function NavLink({ to, children, isActive, onClick, className = '' }: NavLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`text-sm font-medium transition-colors duration-200 ${
        isActive
          ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
          : 'text-gray-600 hover:text-gray-900'
      } ${className}`}
    >
      {children}
    </Link>
  );
}

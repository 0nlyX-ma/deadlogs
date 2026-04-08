import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, User, LogOut, Zap } from 'lucide-react';
import type { AppView } from '@/App';

interface NavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export default function Navigation({ currentView, onNavigate }: NavigationProps) {
  const { user, isAuthenticated, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    onNavigate('landing');
  };

  const scrollToSection = (sectionId: string) => {
    if (currentView !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'How it works', action: () => scrollToSection('how-it-works') },
    { label: 'Pricing', action: () => scrollToSection('pricing') },
    { label: 'Security', action: () => scrollToSection('security') },
  ];

  if (currentView === 'auth-callback') return null;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 bg-lime rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-dark" />
            </div>
            <span className="font-display font-bold text-xl text-white group-hover:text-lime transition-colors">
              Deadlog
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <button
                key={link.label}
                onClick={link.action}
                className="text-sm text-muted-foreground hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="max-w-[120px] truncate">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onNavigate('dashboard')}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-400">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => scrollToSection('upload-section')}
                className="btn-primary"
              >
                Analyze logs
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-dark/95 backdrop-blur-lg md:hidden">
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {navLinks.map(link => (
              <button
                key={link.label}
                onClick={link.action}
                className="text-2xl font-display font-semibold text-white hover:text-lime transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="mt-8 flex flex-col gap-4">
              {isAuthenticated ? (
                <>
                  <Button 
                    onClick={() => {
                      onNavigate('dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="btn-primary"
                  >
                    Dashboard
                  </Button>
                  <Button 
                    onClick={handleSignOut}
                    variant="outline"
                    className="border-white/20"
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => {
                    scrollToSection('upload-section');
                    setMobileMenuOpen(false);
                  }}
                  className="btn-primary"
                >
                  Analyze logs
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

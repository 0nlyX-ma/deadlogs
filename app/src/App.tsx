import { useState, useEffect } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';

// Pages
import LandingPage from '@/pages/LandingPage';
import Dashboard from '@/pages/Dashboard';
import AuthCallback from '@/pages/AuthCallback';

// Components
import Navigation from '@/components/Navigation';

export type AppView = 'landing' | 'dashboard' | 'auth-callback';

function AppContent() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check URL for auth callback
    const path = window.location.pathname;
    if (path === '/auth/callback') {
      setCurrentView('auth-callback');
    } else if (path === '/dashboard') {
      setCurrentView('dashboard');
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    // Update URL when view changes
    if (isInitialized) {
      const path = currentView === 'dashboard' ? '/dashboard' : 
                   currentView === 'auth-callback' ? '/auth/callback' : '/';
      window.history.pushState({}, '', path);
    }
  }, [currentView, isInitialized]);

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onNavigate={navigateTo} />;
      case 'dashboard':
        return <Dashboard onNavigate={navigateTo} />;
      case 'auth-callback':
        return <AuthCallback onNavigate={navigateTo} />;
      default:
        return <LandingPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark text-foreground">
      <Navigation currentView={currentView} onNavigate={navigateTo} />
      <main>
        {renderView()}
      </main>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#1A0B2E',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#F6F3FB',
          },
        }}
      />
      {/* Grain overlay */}
      <div className="grain-overlay" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

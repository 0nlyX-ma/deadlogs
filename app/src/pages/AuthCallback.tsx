import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import type { AppView } from '@/App';

interface AuthCallbackProps {
  onNavigate: (view: AppView) => void;
}

export default function AuthCallback({ onNavigate }: AuthCallbackProps) {
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // The OAuth provider will redirect back with tokens in the URL hash
        // Supabase handles this automatically
        await refreshUser();
        toast.success('Successfully signed in');
        onNavigate('dashboard');
      } catch (error) {
        toast.error('Authentication failed');
        onNavigate('landing');
      }
    };

    handleAuthCallback();
  }, [refreshUser, onNavigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-lime animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Completing sign in...</h2>
        <p className="text-muted-foreground">Please wait while we verify your credentials</p>
      </div>
    </div>
  );
}

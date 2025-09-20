import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/Auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-textPrimary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-textPrimary mb-2">Clipped Set</h1>
          <p className="text-gray-600">Clip your DJ-set for your socials</p>
        </div>
        <LoginForm 
          isSignUp={isSignUp} 
          onToggleMode={() => setIsSignUp(!isSignUp)} 
        />
      </div>
    </div>
  );
};

export default Login;
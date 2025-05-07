import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button.tsx';
import { ShieldAlert, Home } from 'lucide-react';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-red-500" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Access Denied
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          You don't have permission to access this page.
        </p>
        <div className="mt-6">
          <Button
            onClick={() => navigate('/')}
            className="inline-flex items-center"
          >
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 
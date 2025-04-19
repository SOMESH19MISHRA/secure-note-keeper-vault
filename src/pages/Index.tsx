
import React, { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import Dashboard from '@/components/Dashboard';
import MainLayout from '@/components/MainLayout';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<{ id: string; email: string; name: string } | null>(null);

  const handleSuccessfulAuth = (data: { id: string; email: string; name: string }) => {
    setUserData(data);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserData(null);
    toast.success("Logged out successfully");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-vault-light p-4">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center mb-2">
            <div className="bg-vault-primary p-3 rounded-full">
              <Lock className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-vault-dark mb-1">OneVault</h1>
          <p className="text-vault-gray max-w-md mx-auto">
            Your secure personal vault for storing notes, documents, and important information.
          </p>
        </div>
        
        <AuthForm onSuccessfulAuth={handleSuccessfulAuth} />
        
        <div className="mt-10 text-sm text-center text-vault-gray max-w-md">
          <p className="mb-2">
            OneVault keeps your data private and secure. We use end-to-end encryption to ensure only you can access your information.
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="text-vault-primary hover:underline">Privacy Policy</a>
            <a href="#" className="text-vault-primary hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MainLayout userData={userData!} onLogout={handleLogout}>
      <Dashboard />
    </MainLayout>
  );
};

export default Index;

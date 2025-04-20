
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type MainLayoutProps = {
  children: React.ReactNode;
  userData: {
    id: string;
    email: string;
    name: string;
  };
  onLogout: () => void;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children, userData, onLogout }) => {
  useEffect(() => {
    // Check if the bucket exists, create it if it doesn't
    const checkAndCreateBucket = async () => {
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        
        if (!buckets?.find(bucket => bucket.name === 'vault-files')) {
          // We need to create the bucket using SQL due to RLS limitations
          console.log('Vault files bucket needs to be created');
        }
      } catch (error) {
        console.error('Error checking buckets:', error);
      }
    };
    
    checkAndCreateBucket();
  }, []);
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      onLogout();
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.message || "Error logging out");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-vault-primary p-2 rounded-full">
                <div className="h-6 w-6 text-white">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
              </div>
              <h1 className="ml-2 text-xl font-bold text-vault-dark">OneVault</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-vault-gray mr-2" />
                <span className="text-sm font-medium">{userData.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-vault-gray hover:text-vault-dark"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-vault-gray">
            &copy; {new Date().getFullYear()} OneVault. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;

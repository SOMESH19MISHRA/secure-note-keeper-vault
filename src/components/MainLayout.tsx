
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { toast } from "sonner";
import { FileText, FolderClosed, Home, Lock, LogOut, Plus, Search, Settings, User } from "lucide-react";
import { Input } from "@/components/ui/input";

type MainLayoutProps = {
  children: React.ReactNode;
  userData: { id: string; email: string; name: string };
  onLogout: () => void;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children, userData, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Searching for "${searchQuery}"...`);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <VaultSidebar userData={userData} onLogout={onLogout} />
        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b p-4 sticky top-0 z-10 flex justify-between items-center">
            <div className="flex items-center">
              <SidebarTrigger>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                </Button>
              </SidebarTrigger>
              <form onSubmit={handleSearch} className="ml-2 lg:ml-6 relative w-full max-w-sm">
                <Search className="h-4 w-4 absolute left-3 top-3 text-vault-gray" />
                <Input
                  type="search"
                  placeholder="Search vault..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Plus className="mr-2 h-4 w-4" />
                New Entry
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full w-8 h-8 bg-vault-light text-vault-primary"
              >
                <User className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const VaultSidebar: React.FC<{ 
  userData: { id: string; email: string; name: string }; 
  onLogout: () => void;
}> = ({ userData, onLogout }) => {
  return (
    <Sidebar>
      <SidebarHeader className="h-14 flex items-center px-4">
        <Lock className="h-5 w-5 text-vault-primary" />
        <span className="ml-2 text-xl font-bold text-white">OneVault</span>
      </SidebarHeader>
      <SidebarContent>
        <div className="px-3 py-2">
          <div className="mb-4 px-4 py-3 rounded-md bg-sidebar-accent">
            <p className="text-sm font-medium text-vault-primary">{userData.name}</p>
            <p className="text-xs text-gray-400 truncate">{userData.email}</p>
          </div>
          
          <nav className="space-y-2 mt-6">
            <NavItem icon={<Home className="h-5 w-5" />} label="Dashboard" active />
            <NavItem icon={<FileText className="h-5 w-5" />} label="My Notes" />
            <NavItem icon={<FolderClosed className="h-5 w-5" />} label="Categories" />
            <NavItem icon={<Settings className="h-5 w-5" />} label="Settings" />
          </nav>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sidebar-foreground hover:text-white hover:bg-sidebar-accent"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

const NavItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
}> = ({ icon, label, active }) => {
  return (
    <button 
      className={`flex items-center w-full px-4 py-2 rounded-md text-left transition-colors ${
        active 
          ? 'bg-sidebar-primary text-white' 
          : 'text-sidebar-foreground hover:text-white hover:bg-sidebar-accent'
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default MainLayout;

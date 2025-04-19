
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import EntryCard, { VaultEntry } from './EntryCard';
import EntryForm from './EntryForm';
import { toast } from "sonner";

// Mock data for demo purposes
const mockEntries: VaultEntry[] = [
  {
    id: '1',
    title: 'Welcome to OneVault',
    content: 'This is your secure personal vault for storing notes, documents, and important information. Everything is private and only accessible to you.',
    tags: ['welcome', 'getting-started'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Secure Password Tips',
    content: '1. Use a combination of letters, numbers, and symbols\n2. Don\'t reuse passwords across sites\n3. Consider using a password manager\n4. Enable two-factor authentication when available',
    tags: ['security', 'passwords'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Project Ideas',
    content: '- Build a personal finance tracker\n- Learn a new programming language\n- Create a recipe collection app\n- Design a portfolio website',
    tags: ['projects', 'ideas'],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    title: 'Important Links',
    content: 'Google Drive: https://drive.google.com\nGmail: https://gmail.com\nDropbox: https://dropbox.com',
    tags: ['links', 'resources'],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  }
];

const Dashboard: React.FC = () => {
  const [entries, setEntries] = useState<VaultEntry[]>(mockEntries);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<VaultEntry | undefined>(undefined);

  const handleOpenForm = (entry?: VaultEntry) => {
    setCurrentEntry(entry);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setCurrentEntry(undefined);
    setIsFormOpen(false);
  };

  const handleSaveEntry = (entryData: Omit<VaultEntry, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    const now = new Date().toISOString();
    
    if (entryData.id) {
      // Update existing entry
      setEntries(prevEntries => 
        prevEntries.map(entry => 
          entry.id === entryData.id 
            ? { 
                ...entry, 
                ...entryData, 
                updatedAt: now 
              } 
            : entry
        )
      );
      toast.success("Entry updated successfully");
    } else {
      // Create new entry
      const newEntry: VaultEntry = {
        id: Date.now().toString(), // Simple ID generation
        ...entryData,
        createdAt: now,
        updatedAt: now
      };
      
      setEntries(prevEntries => [newEntry, ...prevEntries]);
      toast.success("Entry created successfully");
    }
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryId));
    toast.success("Entry deleted successfully");
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-vault-dark">My Vault</h1>
          <p className="text-vault-gray">Manage your secure notes and information</p>
        </div>
        <Button 
          onClick={() => handleOpenForm()} 
          className="bg-vault-primary hover:bg-vault-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Entry
        </Button>
      </div>
      
      {entries.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-vault-dark mb-2">Your vault is empty</h3>
          <p className="text-vault-gray mb-6">Create your first entry to get started</p>
          <Button 
            onClick={() => handleOpenForm()} 
            className="bg-vault-primary hover:bg-vault-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Entry
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map(entry => (
            <EntryCard 
              key={entry.id} 
              entry={entry} 
              onEdit={() => handleOpenForm(entry)}
              onDelete={handleDeleteEntry}
            />
          ))}
        </div>
      )}
      
      <EntryForm 
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveEntry}
        initialData={currentEntry}
      />
    </div>
  );
};

export default Dashboard;

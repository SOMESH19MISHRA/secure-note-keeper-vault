
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, File, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { VaultEntry, getVaultEntries, deleteVaultEntry, deleteFile } from "@/services/vaultService";
import { Folder } from "@/services/vaultService";
import FileUpload from "./FileUpload";
import EntryForm from './EntryForm';

type VaultEntryListProps = {
  folders: Folder[];
  selectedFolder: Folder | null;
  onRefreshFolders: () => void;
};

const VaultEntryList: React.FC<VaultEntryListProps> = ({ folders, selectedFolder, onRefreshFolders }) => {
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentEntry, setCurrentEntry] = useState<VaultEntry | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  useEffect(() => {
    loadEntries();
  }, [selectedFolder]);
  
  const loadEntries = async () => {
    try {
      setIsLoading(true);
      const data = await getVaultEntries(selectedFolder?.id);
      setEntries(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load entries");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenForm = (entry?: VaultEntry) => {
    setCurrentEntry(entry);
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setCurrentEntry(undefined);
    setIsFormOpen(false);
  };
  
  const handleEntryUpdated = () => {
    loadEntries();
  };
  
  const handleDeleteEntry = async (entry: VaultEntry) => {
    if (!confirm("Are you sure you want to delete this entry?")) {
      return;
    }
    
    try {
      // If it's a file, we need to delete both the storage file and the entry
      if (entry.file_info && entry.file_info.storagePath) {
        await deleteFile(entry.file_info.storagePath, entry.id);
      } else {
        await deleteVaultEntry(entry.id);
      }
      
      setEntries(prev => prev.filter(e => e.id !== entry.id));
      toast.success("Entry deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete entry");
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const renderFilePreview = (entry: VaultEntry) => {
    if (!entry.file_info) return null;
    
    const { contentType, signedUrl } = entry.file_info;
    
    if (contentType?.startsWith('image/') && signedUrl) {
      return (
        <div className="mt-2 rounded overflow-hidden border border-gray-200">
          <img 
            src={signedUrl} 
            alt={entry.title} 
            className="w-full h-32 object-cover" 
          />
        </div>
      );
    }
    
    return (
      <div className="mt-2 flex items-center text-gray-600">
        <File className="h-5 w-5 mr-1" />
        <span className="text-sm truncate">
          {entry.file_info.fileName || 'File'}
          {entry.file_size && ` (${(entry.file_size / 1024 / 1024).toFixed(2)} MB)`}
        </span>
      </div>
    );
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-vault-dark">
            {selectedFolder ? selectedFolder.folder_name : 'All Entries'}
          </h1>
          <p className="text-vault-gray">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => handleOpenForm()}
          >
            <Edit className="mr-2 h-4 w-4" />
            New Note
          </Button>
          <FileUpload 
            folders={folders} 
            currentFolderId={selectedFolder?.id || null} 
            onUploadComplete={loadEntries}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          // Loading placeholders
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-12 bg-gray-100 rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : entries.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium text-vault-dark mb-2">No entries found</h3>
            <p className="text-vault-gray mb-6">
              {selectedFolder 
                ? `This folder is empty. Upload a file or create a note to get started.` 
                : `Your vault is empty. Create your first entry to get started.`}
            </p>
            <div className="flex justify-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => handleOpenForm()}
              >
                <Edit className="mr-2 h-4 w-4" />
                New Note
              </Button>
              <FileUpload 
                folders={folders} 
                currentFolderId={selectedFolder?.id || null} 
                onUploadComplete={loadEntries}
              />
            </div>
          </div>
        ) : (
          // Render entries
          entries.map(entry => (
            <Card key={entry.id} className="h-full flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium truncate">{entry.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                {entry.file_info ? (
                  // File entry
                  renderFilePreview(entry)
                ) : (
                  // Note entry
                  <p className="text-sm text-gray-700 line-clamp-4">{entry.content}</p>
                )}
                
                {entry.category && (
                  <Badge variant="outline" className="mt-3">
                    {entry.category}
                  </Badge>
                )}
              </CardContent>
              <CardFooter className="pt-2 flex justify-between items-center border-t text-xs text-gray-500">
                <span>Updated {formatDate(entry.updated_at)}</span>
                <div className="flex space-x-1">
                  {!entry.file_info && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-500 hover:text-vault-primary"
                      onClick={() => handleOpenForm(entry)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-500 hover:text-destructive"
                    onClick={() => handleDeleteEntry(entry)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      
      <EntryForm 
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleEntryUpdated}
        initialData={currentEntry}
        folders={folders}
        selectedFolderId={selectedFolder?.id || null}
      />
    </div>
  );
};

export default VaultEntryList;

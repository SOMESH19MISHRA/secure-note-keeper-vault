
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Folder, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Folder as FolderType, createFolder, deleteFolder, getFolders } from "@/services/vaultService";

type FolderListProps = {
  onSelectFolder: (folder: FolderType | null) => void;
  selectedFolderId: string | null;
};

const FolderList: React.FC<FolderListProps> = ({ onSelectFolder, selectedFolderId }) => {
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      setIsLoading(true);
      const foldersData = await getFolders();
      setFolders(foldersData);
    } catch (error: any) {
      toast.error(error.message || "Failed to load folders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      setIsCreatingFolder(true);
      const createdFolder = await createFolder(newFolderName.trim());
      setFolders(prev => [createdFolder, ...prev]);
      setIsCreateDialogOpen(false);
      setNewFolderName('');
      toast.success("Folder created successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to create folder");
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleDeleteFolder = async (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this folder? All entries in this folder will be moved to the root.")) {
      return;
    }
    
    try {
      await deleteFolder(folderId);
      setFolders(prev => prev.filter(folder => folder.id !== folderId));
      
      // If the deleted folder was selected, reset to All
      if (selectedFolderId === folderId) {
        onSelectFolder(null);
      }
      
      toast.success("Folder deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete folder");
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-vault-dark">Folders</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsCreateDialogOpen(true)}
          className="text-vault-primary"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Folder
        </Button>
      </div>
      
      <div className="flex flex-row flex-wrap gap-3">
        <Card 
          className={`w-32 cursor-pointer transition-colors ${!selectedFolderId ? 'bg-vault-light' : 'hover:bg-gray-50'}`}
          onClick={() => onSelectFolder(null)}
        >
          <CardContent className="p-3 flex flex-col items-center justify-center text-center">
            <Folder className="h-8 w-8 mb-1 text-gray-500" />
            <span className="text-sm font-medium">All Entries</span>
          </CardContent>
        </Card>
        
        {isLoading && folders.length === 0 ? (
          <Card className="w-32 h-20">
            <CardContent className="p-3 flex items-center justify-center">
              <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
            </CardContent>
          </Card>
        ) : (
          folders.map(folder => (
            <Card 
              key={folder.id} 
              className={`w-32 cursor-pointer transition-colors ${selectedFolderId === folder.id ? 'bg-vault-light' : 'hover:bg-gray-50'}`}
              onClick={() => onSelectFolder(folder)}
            >
              <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                <Folder className="h-8 w-8 mb-1 text-vault-primary" />
                <span className="text-sm font-medium truncate w-full">{folder.folder_name}</span>
              </CardContent>
              <CardFooter className="p-1 justify-end">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={(e) => handleDeleteFolder(folder.id, e)}
                >
                  <Trash2 className="h-3 w-3 text-gray-400" />
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              maxLength={50}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(false)}
              disabled={isCreatingFolder}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateFolder} 
              disabled={!newFolderName.trim() || isCreatingFolder}
              className="bg-vault-primary hover:bg-vault-primary/90"
            >
              {isCreatingFolder ? (
                <span className="flex items-center">
                  <span className="h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full animate-spin mr-2"></span>
                  Creating...
                </span>
              ) : (
                'Create Folder'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FolderList;

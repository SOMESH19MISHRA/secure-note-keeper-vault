
import React, { useState, useEffect } from 'react';
import FolderList from './FolderList';
import VaultEntryList from './VaultEntryList';
import { Folder, getFolders } from '@/services/vaultService';
import { toast } from "sonner";

const Dashboard: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      setIsLoadingFolders(true);
      const foldersData = await getFolders();
      setFolders(foldersData);
    } catch (error: any) {
      toast.error(error.message || "Failed to load folders");
    } finally {
      setIsLoadingFolders(false);
    }
  };

  const handleSelectFolder = (folder: Folder | null) => {
    setSelectedFolder(folder);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <FolderList 
        onSelectFolder={handleSelectFolder}
        selectedFolderId={selectedFolder?.id || null}
      />
      
      <VaultEntryList 
        folders={folders}
        selectedFolder={selectedFolder}
        onRefreshFolders={loadFolders}
      />
    </div>
  );
};

export default Dashboard;

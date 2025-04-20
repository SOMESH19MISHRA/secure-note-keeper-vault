
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Folder, VaultEntry, createTextEntry, updateVaultEntry } from '@/services/vaultService';

type EntryFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: VaultEntry;
  folders: Folder[];
  selectedFolderId: string | null;
};

const EntryForm: React.FC<EntryFormProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData,
  folders,
  selectedFolderId
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [folderId, setFolderId] = useState<string | null>(null);
  const [category, setCategory] = useState('note');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content || '');
      setFolderId(initialData.folder_id);
      setCategory(initialData.category || 'note');
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    if (!initialData && isOpen) {
      setFolderId(selectedFolderId);
    }
  }, [initialData, selectedFolderId, isOpen]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setFolderId(selectedFolderId);
    setCategory('note');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (initialData) {
        // Update existing entry
        await updateVaultEntry(initialData.id, {
          title: title.trim(),
          content: content.trim(),
          folder_id: folderId,
          category: category || null
        });
        toast.success("Entry updated successfully");
      } else {
        // Create new entry
        await createTextEntry({
          title: title.trim(),
          content: content.trim(),
          folder_id: folderId,
          category: category || null
        });
        toast.success("Entry created successfully");
      }
      
      onSave();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "An error occurred while saving the entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Entry' : 'Create New Entry'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter entry title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your notes, links, or other content..."
              className="min-h-[150px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="folder">Folder</Label>
            <Select value={folderId || ''} onValueChange={(value) => setFolderId(value || null)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a folder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Root (No folder)</SelectItem>
                {folders.map(folder => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.folder_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category || ''} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="note">Note</SelectItem>
                <SelectItem value="password">Password</SelectItem>
                <SelectItem value="contact">Contact</SelectItem>
                <SelectItem value="link">Link</SelectItem>
                <SelectItem value="code">Code</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-vault-primary hover:bg-vault-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <span className="h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full animate-spin mr-2"></span>
                  Saving...
                </span>
              ) : (
                'Save Entry'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EntryForm;

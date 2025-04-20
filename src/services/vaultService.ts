
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

// Folder types
export interface Folder {
  id: string;
  folder_name: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Vault entry types
export interface VaultEntry {
  id: string;
  title: string;
  content: string | null;
  category: string | null;
  folder_id: string | null;
  file_info: any | null;
  file_size: number | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Folders
export async function createFolder(folderName: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error("Authentication required");
  }
  
  const { data, error } = await supabase
    .from('folders')
    .insert([{ folder_name: folderName, user_id: userData.user.id }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getFolders() {
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function deleteFolder(folderId: string) {
  const { error } = await supabase
    .from('folders')
    .delete()
    .eq('id', folderId);
  
  if (error) throw error;
  return true;
}

// Vault entries
export async function getVaultEntries(folderId?: string) {
  let query = supabase.from('vault_entries').select('*');
  
  if (folderId) {
    query = query.eq('folder_id', folderId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function createTextEntry(entry: {
  title: string;
  content: string;
  folder_id?: string | null;
  category?: string | null;
}) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error("Authentication required");
  }
  
  const { data, error } = await supabase
    .from('vault_entries')
    .insert([{
      ...entry,
      user_id: userData.user.id
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateVaultEntry(id: string, updates: {
  title?: string;
  content?: string;
  category?: string | null;
  folder_id?: string | null;
}) {
  const { data, error } = await supabase
    .from('vault_entries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteVaultEntry(id: string) {
  const { error } = await supabase
    .from('vault_entries')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

// File uploads
export async function uploadFile(file: File, options?: {
  title?: string;
  folder_id?: string | null;
  category?: string | null;
}) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error("Authentication required");
  }
  
  // Create unique filename to avoid collisions
  const userId = userData.user.id;
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;
  
  // Upload to storage
  const { data: fileData, error: uploadError } = await supabase.storage
    .from('vault-files')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (uploadError) throw uploadError;
  
  // Get file URL
  const { data: urlData } = await supabase.storage
    .from('vault-files')
    .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
  
  // Create vault entry for the file
  const fileInfo = {
    fileName: file.name,
    contentType: file.type,
    storagePath: filePath,
    signedUrl: urlData?.signedUrl
  };
  
  const { data: entryData, error: entryError } = await supabase
    .from('vault_entries')
    .insert([{
      title: options?.title || file.name,
      folder_id: options?.folder_id || null,
      category: options?.category || 'file',
      file_info: fileInfo,
      file_size: file.size,
      user_id: userId
    }])
    .select()
    .single();
  
  if (entryError) throw entryError;
  
  return entryData;
}

export async function getFileUrl(filePath: string) {
  const { data, error } = await supabase.storage
    .from('vault-files')
    .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
  
  if (error) throw error;
  return data.signedUrl;
}

export async function deleteFile(filePath: string, entryId: string) {
  // Delete the file from storage
  const { error: storageError } = await supabase.storage
    .from('vault-files')
    .remove([filePath]);
  
  if (storageError) throw storageError;
  
  // Delete the corresponding vault entry
  const { error: entryError } = await supabase
    .from('vault_entries')
    .delete()
    .eq('id', entryId);
  
  if (entryError) throw entryError;
  
  return true;
}

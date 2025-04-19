
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export type VaultEntry = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

type EntryCardProps = {
  entry: VaultEntry;
  onEdit: (entry: VaultEntry) => void;
  onDelete: (entryId: string) => void;
};

const EntryCard: React.FC<EntryCardProps> = ({ entry, onEdit, onDelete }) => {
  const formattedDate = new Date(entry.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  return (
    <Card className="vault-card h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium truncate">{entry.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-gray-700 line-clamp-4">{entry.content}</p>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {entry.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="bg-vault-light text-vault-dark">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center border-t text-xs text-gray-500">
        <span>Updated {formattedDate}</span>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-500 hover:text-vault-primary"
            onClick={() => onEdit(entry)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-500 hover:text-destructive"
            onClick={() => onDelete(entry.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EntryCard;

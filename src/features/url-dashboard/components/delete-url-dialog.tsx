"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteUrlDialogProps {
  urlId: string;
  shortUrl: string;
  onDelete: (id: string) => Promise<void>;
  onSuccess?: () => void;
}

export function DeleteUrlDialog({
  urlId,
  shortUrl,
  onDelete,
  onSuccess,
}: DeleteUrlDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(urlId);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Failed to delete URL",
        description: "The URL has not been deleted.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-700 hover:bg-red-100"
          disabled={isDeleting}
          data-testid="dialog-trigger-delete-url"
        >
          {isDeleting ? (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          <span className="sr-only">Delete URL</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Shortened URL</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">{shortUrl}</span>?
            This action cannot be undone and anyone using this shortened URL
            will no longer be redirected.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 text-white"
            data-testid="dialog-action-delete-url"
          >
            Delete URL
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

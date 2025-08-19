"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";

import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { AlertDescription, AlertTitle } from "./ui/alert";

import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";

interface Props {
  documentId: Id<"documents">;
  children: React.ReactNode;
}

const RemoveDialog = ({ documentId, children }: Props) => {
  const router = useRouter();
  const remove = useMutation(api.document.removeById);

  const [isRemoving, setIsRemoving] = useState(false);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogTitle />
        <AlertDialogHeader>
          <AlertTitle>Are you sure?</AlertTitle>
          <AlertDescription>
            This action cannot be undone. This will permanently delete your
            document.
          </AlertDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isRemoving}
            onClick={(e) => {
              e.stopPropagation();
              setIsRemoving(true);
              remove({ id: documentId })
                .catch(() => toast.error("Something went wrong"))
                .then(() => {
                  toast.success("Document removed");
                  router.push("/");
                })
                .finally(() => setIsRemoving(false));
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveDialog;

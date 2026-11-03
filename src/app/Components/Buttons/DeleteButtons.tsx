'use client';

import { IBook } from '@/app/all-books/[bookId]/page';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { getTokenFromClient } from '@/lib/getTokenFromClient';

const DeleteButtons = ({ book }: { book: IBook }) => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const handleOpen = () => {
    if (!user?.email) {
      toast.error('You must be logged in to delete this book.');
      return;
    }
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
  const token = await getTokenFromClient();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/my-books/${encodeURIComponent(user?.email ?? '')}/${book._id}`,
    {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

      if (!res.ok) {
        throw new Error('Failed to delete book');
      }

      setOpen(false);
      toast.success('Successfully Deleted');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <Button
        type="button"
        variant="destructive"
        onClick={handleOpen}
        disabled={isPending || isDeleting}
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              Do you really want to remove this book? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteButtons;
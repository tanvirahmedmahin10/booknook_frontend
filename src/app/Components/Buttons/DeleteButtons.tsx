'use client'
import { IBook } from '@/app/all-books/[bookId]/page';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const DeleteButtons = ({ book }: { book: IBook }) => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [isDeleting, setIsDeleting] = useState(false);
const route=useRouter()
  const handleDelete = async () => {
    
    if (!user?.email) {
      alert('You must be logged in to delete this book.');
      return;
    }

    const confirmed = confirm('Are you sure you want to remove this book?');
    if (!confirmed) return;

    try {
      setIsDeleting(true);

      const res = await fetch(
        `http://localhost:8000/my-books/${user.email}/${book._id}`,
        {
          method: 'DELETE', 
        }
      );

      if (!res.ok) {
        throw new Error('Failed to delete book');
      }

    
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the book.');
    } finally {
      setIsDeleting(false);
    }
    route.refresh()
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending || isDeleting}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
};

export default DeleteButtons;
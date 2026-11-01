"use client";

import React, { useState, useEffect } from 'react';
import { IBook } from '../all-books/[bookId]/page';
import { authClient } from '@/lib/auth-client';

interface BorrowingBooksProps {
  bookDetails: IBook;
}

const BorrowingBooks = ({ bookDetails }: BorrowingBooksProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  const { 
    data: session, 
    isPending,
  } = authClient.useSession();

  const user = session?.user;
  const allInfo = {
    ...bookDetails,
    user_name: user?.name || "Anonymous",
    user_email: user?.email || "",
  };

  useEffect(() => {
    const checkBorrowStatus = async () => {
      const bookId = (bookDetails as IBook)._id ;
      if (!user?.email || !bookId) {
        setIsCheckingStatus(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:8000/my-borrows/${user.email}/${bookId}`);
        if (res.ok) {
          const data = await res.json();
          setIsBorrowed(data.isBorrowed);
        }
      } catch (error) {
        console.error("Error verifying borrow state:", error);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    if (!isPending) {
      checkBorrowStatus();
    }
  }, [user?.email, bookDetails, isPending]);

  const handleBorrow = async () => {
    if (isBorrowed) {
      alert("Already borrowed");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`http://localhost:8000/my-borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(allInfo),
      });

      if (!res.ok) {
        throw new Error(`Failed to borrow: ${res.statusText}`);
      }
      setIsBorrowed(true);
      const data = await res.json();
      console.log("Borrow successful:", data);
    } catch (error) {
      console.error("Borrow error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = isLoading || isPending || isCheckingStatus || !user;

  return (
    <button
      type="button"
      onClick={handleBorrow}
      disabled={isDisabled}
      className={`w-full py-3.5 rounded-xl font-semibold text-sm shadow-sm transition text-white ${
        isBorrowed
          ? "bg-emerald-600 cursor-not-allowed"
          : "bg-[#1a62ff] hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      }`}
    >
      {isBorrowed
        ? "Borrowed"
        : isLoading
        ? "Borrowing..."
        : isPending || isCheckingStatus
        ? "Loading..."
        : !user
        ? "Log in to Borrow"
        : "Borrow This Book"}
    </button>
  );
};

export default BorrowingBooks;
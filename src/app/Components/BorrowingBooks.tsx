"use client";

import React, { useState, useEffect } from "react";
import { IBook } from "../all-books/[bookId]/page";
import { authClient } from "@/lib/auth-client";

interface BorrowingBooksProps {
  bookDetails: IBook;
}

const BorrowingBooks = ({ bookDetails }: BorrowingBooksProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];
  const [borrowDate, setBorrowDate] = useState(todayStr);
  const [returnDate, setReturnDate] = useState("");

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const bookId = bookDetails?._id;
useEffect(() => {
  const checkBorrowStatus = async () => {
    if (!user?.email || !bookId) {
      setIsCheckingStatus(false);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/my-borrows/${encodeURIComponent(user.email)}/${bookId}`
      );
      if (res.ok) {
        const result = await res.json();
        setIsBorrowed(Boolean(result?.isBorrowed));
      } else {
        setIsBorrowed(false);
      }
    } catch (error) {
      console.error("Error verifying borrow state:", error);
      setIsBorrowed(false);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  if (!isPending) {
    checkBorrowStatus();
  }
}, [user?.email, bookId, isPending]);

  const handleConfirmBorrow = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isBorrowed) {
      alert("Already borrowed");
      return;
    }

    if (!borrowDate || !returnDate) {
      alert("Please select both borrow and return dates.");
      return;
    }

    if (new Date(returnDate) < new Date(borrowDate)) {
      alert("Return date cannot be earlier than borrow date.");
      return;
    }

    setIsLoading(true);
    const { _id, ...restBookDetails } = bookDetails || {};

    const payload = {
      book_id: _id, 
      ...restBookDetails,

      user_id: user?.id || null,
      user_name: user?.name || "Anonymous",
      user_email: user?.email || "",
      user_image: user?.image || null,
      borrow_date: borrowDate,
      return_date: returnDate,
      status: "borrowed",
      created_at: new Date().toISOString(),
    };

    try {
      const res = await fetch(`http://localhost:8000/my-borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Failed to borrow: ${res.statusText}`);
      }

      setIsBorrowed(true);
      setIsModalOpen(false);
      const data = await res.json();
      console.log("Borrow successful:", data);
    } catch (error) {
      console.error("Borrow error:", error);
      alert("Failed to confirm borrow. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = isPending || isCheckingStatus || !user || isBorrowed;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        disabled={isDisabled}
        className={`w-full py-3.5 rounded-xl font-semibold text-sm shadow-sm transition text-white ${
          isBorrowed
            ? "bg-emerald-600 cursor-not-allowed"
            : "bg-[#1a62ff] hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        }`}
      >
        {isBorrowed
          ? "Borrowed"
          : isPending || isCheckingStatus
          ? "Loading..."
          : !user
          ? "Log in to Borrow"
          : "Borrow This Book"}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Borrow Book</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmBorrow} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  User Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={user?.name || "Anonymous"}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  User Email
                </label>
                <input
                  type="email"
                  readOnly
                  value={user?.email || ""}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Borrow Date
                  </label>
                  <input
                    type="date"
                    required
                    value={borrowDate}
                    onChange={(e) => setBorrowDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Return Date
                  </label>
                  <input
                    type="date"
                    required
                    min={borrowDate}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-lg bg-[#1a62ff] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? "Borrowing..." : "Confirm Borrow"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BorrowingBooks;
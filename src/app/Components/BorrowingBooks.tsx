"use client";

import React, { useState, useEffect } from "react";
import { IBook } from "../all-books/[bookId]/page";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface BorrowingBooksProps {
  bookDetails: IBook;
}

const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const BorrowingBooks = ({ bookDetails }: BorrowingBooksProps) => {
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const rawCopies = Number(bookDetails?.total_copies ?? 0);
  const [copies, setCopies] = useState<number>(
    Number.isNaN(rawCopies) ? 0 : rawCopies
  );

  const borrowDate = getTodayDateString();
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

  const handleButtonClick = () => {
    if (isBorrowed) {
      toast.error("This book is already borrowed.");
      return;
    }
    if (!user) {
      toast.error("Please log in to borrow books.");
      return;
    }
    if (copies <= 0) {
      toast.error("This book is currently out of stock.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmBorrow = async (e: React.FormEvent) => {
    e.preventDefault();

    if (copies <= 0) {
      toast.error("This book is currently out of stock.");
      return;
    }

    if (isBorrowed) {
      toast.error("Already borrowed");
      return;
    }

    if (!borrowDate || !returnDate) {
      toast.error("Please select both borrow and return dates.");
      return;
    }

    if (new Date(returnDate) < new Date(borrowDate)) {
      toast.error("Return date cannot be earlier than borrow date.");
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
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `Failed to borrow: ${res.statusText}`);
      }
      setCopies((prev) => Math.max(0, prev - 1));
      setIsBorrowed(true);
      setIsModalOpen(false);
      await res.json();
      route.refresh();
      toast.success("Successful Borrow");
    } catch (error) {
      console.error("Borrow error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to confirm borrow. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isAvailable = copies > 0;
  const isButtonDisabled = isPending || isCheckingStatus;

  const getButtonState = () => {
    if (isPending || isCheckingStatus) {
      return {
        label: "Loading...",
        className: "bg-slate-200 text-slate-500 cursor-not-allowed",
      };
    }
    if (isBorrowed) {
      return {
        label: "Borrowed",
        className: "bg-emerald-600 text-white cursor-not-allowed opacity-90",
      };
    }
    if (!isAvailable) {
      return {
        label: "Not Available",
        className: "bg-slate-200 text-slate-500 cursor-not-allowed",
      };
    }
    if (!user) {
      return {
        label: "Log in to Borrow",
        className: "bg-[#1a62ff] text-white opacity-50 cursor-pointer",
      };
    }
    return {
      label: "Borrow This Book",
      className: "bg-[#1a62ff] hover:bg-blue-700 text-white cursor-pointer",
    };
  };

  const { label, className } = getButtonState();

  return (
    <>
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={isButtonDisabled}
        className={`w-full py-3.5 rounded-xl font-semibold text-sm shadow-sm transition ${className}`}
      >
        {label}
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
                    readOnly
                    value={borrowDate}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none cursor-not-allowed"
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
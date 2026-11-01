'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IBook } from '@/app/all-books/[bookId]/page';

export interface IBorrowedBook extends IBook {
  borrow_date?: string;
  return_date?: string;
  borrowId?: string;
}

interface Props {
  borrowedBooks: IBorrowedBook[];
  onReturnSuccess?: (bookId: string) => void;
}

export default function BorrowBooksList({ borrowedBooks = [], onReturnSuccess }: Props) {
  const [books, setBooks] = useState<IBorrowedBook[]>(borrowedBooks);
  const [returningId, setReturningId] = useState<string | null>(null);

  const handleReturnBook = async (book: IBorrowedBook) => {
    const targetId = book.borrowId || book._id;
    const confirmReturn = window.confirm(`Are you sure you want to return "${book.title}"?`);
    if (!confirmReturn) return;

    setReturningId(targetId as string);

    try {
      const res = await fetch(`http://localhost:8000/my-borrows/${targetId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to return the book');
      }

      
      setBooks((prev) => prev.filter((b) => (b.borrowId || b._id) !== targetId));
      if (onReturnSuccess) {
        onReturnSuccess(targetId as string);
      }
    } catch (error) {
      console.error('Error returning book:', error);
      alert('Could not complete return request. Please try again.');
    } finally {
      setReturningId(null);
    }
  };

  if (!books || books.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800">No Borrowed Books Found</h3>
            <p className="mt-1 text-sm text-slate-500">
              You haven&apos;t borrowed any books yet. Explore our collection to find your next read.
            </p>
            <div className="mt-6">
              <Link
                href="/all-books"
                className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 transition-colors"
              >
                Browse Books
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Borrowed Books
          </h1>
          <p className="mt-2 text-base text-slate-600 font-serif">
            Keep track of your borrowed titles, due dates, and manage returns.
          </p>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th scope="col" className="py-4 pl-6 pr-3">Book</th>
                  <th scope="col" className="px-4 py-4">Category</th>
                  <th scope="col" className="px-4 py-4">Borrow Date</th>
                  <th scope="col" className="px-4 py-4">Return Date</th>
                  <th scope="col" className="py-4 pl-3 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {books.map((book) => {
                  const currentId = book.borrowId || book._id;
                  const isProcessing = returningId === currentId;

                  return (
                    <tr
                      key={currentId}
                      className="group transition-colors hover:bg-slate-50/60"
                    >
                      {/* Image & Title */}
                      <td className="py-4 pl-6 pr-3">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200/60">
                            {book.cover_image ? (
                              <Image
                                src={book.cover_image}
                                alt={book.title}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                                N/A
                              </div>
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/all-books/${book._id}`}
                              className="font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1"
                              title={book.title}
                            >
                              {book.title}
                            </Link>
                            <p className="text-xs text-slate-500 mt-0.5">
                              By <span className="text-slate-700">{book.author}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {book.category ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/10">
                            {book.category}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>

                      {/* Borrow Date */}
                      <td className="px-4 py-4 whitespace-nowrap text-slate-600 font-medium text-xs">
                        {book.borrow_date || 'N/A'}
                      </td>

                      {/* Return Date */}
                      <td className="px-4 py-4 whitespace-nowrap text-slate-600 font-medium text-xs">
                        {book.return_date || 'N/A'}
                      </td>

                      {/* Return Button */}
                      <td className="py-4 pl-3 pr-6 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleReturnBook(book)}
                          disabled={isProcessing}
                          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-rose-600 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {isProcessing ? 'Returning...' : 'Return Book'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
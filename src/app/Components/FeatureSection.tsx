import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IBook } from '../all-books/[bookId]/page';

const FeatureSection = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/all-books`, {
    cache: 'no-store',
  });
  const allBooks = await res.json();

  
  const latestBooks = allBooks.slice(-6).reverse()

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-sm font-semibold tracking-wide uppercase text-indigo-600">
          Fresh Off The Press
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          New Arrivals
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {latestBooks.map((book:IBook) => (
          <article
            key={book._id}
            className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition-all duration-300"
          >
            <div className="relative aspect-[4/2] w-full overflow-hidden bg-slate-100">
              <Image
                src={book.cover_image}
                alt={book.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                priority={false}
              />
            </div>

            <div className="flex flex-1 flex-col justify-between p-6">
              <div className="space-y-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/10">
                  {book.category}
                </span>

                <h3
                  className="text-xl font-bold text-slate-900 tracking-tight line-clamp-1 group-hover:text-indigo-600 transition-colors"
                  title={book.title}
                >
                  {book.title}
                </h3>

                <p className="text-sm font-medium text-slate-500">
                  By <span className="text-slate-700">{book.author}</span>
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href={`/all-books/${book._id}`}
                  className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <Link
          href="/all-books"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200"
        >
          <span>See All Books</span>
          <svg
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
};

export default FeatureSection;

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { IBook } from '@/app/all-books/[bookId]/page';
import EditButtons from './Buttons/EditButtons';
import DeleteButtons from './Buttons/DeleteButtons';

interface Props {
  books: IBook[];
}

export default function MyBooksList({ books }: Props) {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <article
              key={book._id}
              className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition-all duration-300"
            >
              <div className="relative aspect-[2/1] w-full overflow-hidden bg-slate-100">
                {book.cover_image ? (
                  <Image
                    src={book.cover_image}
                    alt={book.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out"
                    priority={false}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div className="space-y-3">
                  {book.category && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/10">
                      {book.category}
                    </span>
                  )}

                  <h2
                    className="text-xl font-bold text-slate-900 tracking-tight line-clamp-1 group-hover:text-indigo-600 transition-colors"
                    title={book.title}
                  >
                    {book.title}
                  </h2>

                  <p className="text-sm font-medium text-slate-500">
                    By <span className="text-slate-700">{book.author}</span>
                  </p>
                </div>

                <div className="pt-1 my-2">
                  <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Description
                  </h2>

                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-4">
                    {book.description}
                  </p>
                </div>
                 <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
  <Link
    href={`/all-books/${book._id}`}
    className="flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-600 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
  >
    View Details
  </Link>

  <EditButtons book={book} />
  <DeleteButtons book={book} />
</div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </main>
  );
}

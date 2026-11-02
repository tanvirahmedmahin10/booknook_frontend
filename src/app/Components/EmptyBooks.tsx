import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function EmptyBooks() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-[#141414] px-6 py-20 text-center text-white shadow-md">
   
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-gray-400">
        <BookOpen className="h-7 w-7 stroke-[1.5]" />
      </div>

      
      <h2 className="mb-2 text-2xl font-semibold tracking-tight text-white font-serif">
        You haven&apos;t contributed any books yet
      </h2>

     
      <p className="mb-8 max-w-md text-sm text-gray-400">
        Add books from your physical or digital shelf so community members can discover and borrow them!
      </p>

    
      <Link
        href="/add-book"
        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 active:scale-[0.99]"
      >
        Add Your First Book
      </Link>
    </div>
  );
}
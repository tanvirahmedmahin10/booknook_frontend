import Image from 'next/image';
import Link from 'next/link';
export const metadata = { title: 'All Books' };  
interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  published_year: number;
  rating: number;
  price: number;
  in_stock: boolean;
  cover_image: string;
  description: string;
}

const AllBooksPage = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/all-books`, {
    cache: 'no-store', 
  });
  const allBooks: Book[] = await res.json();

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
   
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Explore Books
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Browse through our curated collection of literary gems.
          </p>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {allBooks.map((book) => (
            <article
              key={book._id}
              className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition-all duration-300"
            >
        
              <div className="relative aspect-4/2 w-full overflow-hidden bg-slate-100">
                <Image
                  src={book.cover_image}
                  alt={book.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out"
                  priority={false}
                />
              </div>

            
              <div className="flex flex-1 flex-col justify-between p-6">
                <div className="space-y-3">
                 
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/10">
                    {book.category}
                  </span>

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
      </div>
    </main>
  );
};

export default AllBooksPage;
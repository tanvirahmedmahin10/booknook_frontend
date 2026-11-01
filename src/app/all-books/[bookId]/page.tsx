import Image from "next/image";
import { notFound } from "next/navigation";
import { Star, Calendar } from "lucide-react";

export interface IParams {
  params: Promise<{
    bookId: string;
  }>;
}

export interface IBook {
  _id?: string;
  title: string;
  author: string;
  category: string;
  published_year: number;
  price: number;
  rating: number;
  in_stock: boolean;
  cover_image: string;
  description: string;
  user_name?: string;
  user_email?:string,
  added_by?: string;
}

const DetailsPage = async ({ params }: IParams) => {
  const { bookId } = await params;

  let bookDetails: IBook | null = null;

  try {
    const res = await fetch(`http://localhost:8000/all-books/${bookId}`, {
      cache: "no-store",
    });

    if (!res.ok) notFound();
    bookDetails = await res.json();
  } catch {
    notFound();
  }

  if (!bookDetails) notFound();

  return (
    <main className="w-full flex justify-center py-12 px-4 bg-white">
      <div className="w-full max-w-[820px] bg-white border border-gray-200/80 rounded-[32px] p-8 md:p-10 shadow-sm min-h-[500px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          
          <div className="relative w-full aspect-[4/5] min-h-[380px] md:min-h-[440px] rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
            {bookDetails.cover_image ? (
              <Image
                src={bookDetails.cover_image}
                alt={bookDetails.title}
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                No Image
              </div>
            )}
          </div>

          
          <div className="flex flex-col justify-between py-1">
            <div className="space-y-4">
              <div>
                <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold tracking-wider px-3.5 py-1 rounded-full uppercase">
                  {bookDetails.category || "General"}
                </span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
                  {bookDetails.title}
                </h1>
                <p className="text-sm text-gray-600 mt-1.5">
                  By <span className="font-semibold text-gray-900">{bookDetails.author}</span>
                </p>
              </div>

              <div className="grid grid-cols-3 bg-[#f8fafc] rounded-2xl py-3 px-4 text-center items-center border border-slate-100">
                <div>
                  <span className="text-[11px] text-gray-400 block font-medium">Price</span>
                  <span className="text-sm font-bold text-gray-800">
                    ${bookDetails.price ? Number(bookDetails.price).toFixed(2) : "0.00"}
                  </span>
                </div>
                <div className="border-x border-slate-200/70">
                  <span className="text-[11px] text-gray-400 block font-medium">Rating</span>
                  <span className="text-sm font-bold text-gray-800 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {bookDetails.rating ?? 4.5}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 block font-medium">Year</span>
                  <span className="text-sm font-bold text-gray-800 flex items-center justify-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {bookDetails.published_year}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                Added by:{" "}
                <span className="font-medium text-gray-800">
                  {bookDetails.user_name || bookDetails.added_by || "Community Member"}
                </span>
              </p>

              <div className="pt-1">
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Description
                </h2>
                <p className="text-gray-600 text-xs leading-relaxed line-clamp-4">
                  {bookDetails.description}
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                className="w-full py-3.5 rounded-xl font-semibold text-sm bg-[#1a62ff] hover:bg-blue-700 text-white shadow-sm transition cursor-pointer"
              >
                Borrow This Book
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default DetailsPage;
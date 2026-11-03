import { IBook, IParams } from '@/app/all-books/[bookId]/page';

import { notFound } from 'next/navigation';
import BorrowBooksList from '@/app/Components/BorrowBooksList';
import { getTokenFromServer } from '@/lib/getTokenFromServer';

export const metadata = { title: 'My Borrows' };
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const Page = async ({ params }: IParams) => {
  const { bookId } = await params;
  const email = safeDecode(bookId);
  
    if (!EMAIL_REGEX.test(email)) {
      notFound();
    }
  let books: IBook[] = [];
 const token=await getTokenFromServer()
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-borrows/${bookId}`, {
      cache: 'no-store',
      headers: {
    authorization: `Bearer ${token}`,
  }
    });

    if (!res.ok) {
      if (res.status === 404)
      notFound();
    }

    const data = await res.json();
    books = Array.isArray(data) ? data : data?.data || [data];
  } catch {
    notFound();
  }

  return <BorrowBooksList borrowedBooks={books} />;
};

export default Page;
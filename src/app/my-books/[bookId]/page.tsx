import { IBook, IParams } from '@/app/all-books/[bookId]/page';
import MyBooksList from '@/app/Components/MyBooksList';
import EmptyBooks from '@/app/Components/EmptyBooks';
import { notFound } from 'next/navigation';

export const metadata = { title: 'My Books' }; 
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

  const res = await fetch(
    `http://localhost:8000/my-books/${encodeURIComponent(email)}`,
    { cache: 'no-store' }
  );

  if (res.ok) {
    const data = await res.json();
    books = Array.isArray(data) ? data : data?.data ?? (data ? [data] : []);
  } else if (res.status !== 404) {

    throw new Error('Failed to fetch books');
  }


  if (books.length === 0) {
    return <EmptyBooks />;
  }

  return <MyBooksList books={books} />;
};

export default Page;
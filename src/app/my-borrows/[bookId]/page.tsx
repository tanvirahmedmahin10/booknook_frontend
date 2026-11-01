import { IBook, IParams } from '@/app/all-books/[bookId]/page';
import MyBooksList from '@/app/Components/MyBooksList';
import EmptyBooks from '@/app/Components/EmptyBooks';
import { notFound } from 'next/navigation';
import React from 'react';
import BorrowBooksList from '@/app/Components/BorrowBooksList';

const Page = async ({ params }: IParams) => {
  const { bookId } = await params;
  let books: IBook[] = [];

  try {
    const res = await fetch(`http://localhost:8000/my-borrows/${bookId}`, {
      cache: 'no-store',
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

  if (!books || books.length === 0) {
    return <EmptyBooks />;
  }

  return <BorrowBooksList borrowedBooks={books} />;
};

export default Page;
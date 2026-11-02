import React from "react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-start justify-center px-4 py-16">
      <p className="text-sm font-semibold text-indigo-600">
        Error 404
      </p>

      <h1 className="mt-3 text-5xl font-bold text-gray-900">
        This page isn&rsquo;t on our shelves
      </h1>

      <p className="mt-4 max-w-lg text-lg leading-relaxed text-gray-600">
        The page you&rsquo;re looking for may have been moved, removed, or never
        existed. Check the address, or head back and keep browsing.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-xl bg-gray-900 px-6 py-3 text-white transition hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Back to home
        </Link>
        <Link
          href="/all-books"
          className="rounded-xl border border-gray-300 px-6 py-3 text-gray-900 transition hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Browse books
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
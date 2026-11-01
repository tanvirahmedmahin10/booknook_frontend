import React from 'react';
import Link from 'next/link';

const steps = [
  {
    step: '01',
    title: 'Browse & Discover',
    description:
      'Search through our extensive catalog of titles across genres to find your next great read.',
    icon: (
      <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Select & Borrow',
    description:
      'Choose your borrowing duration and checkout instantly using your free reader membership.',
    icon: (
      <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Easy Return or Renew',
    description:
      'Return in person, via drop box, or renew your lending period online with a single tap before the due date.',
    icon: (
      <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
];

const BorrowingWorks = () => {
  return (
    <section className="py-16 px-4 bg-slate-50/60 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto">

        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/10">
            Simple Process
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How Borrowing Works
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Getting your hands on your favorite books is effortless. Follow three easy steps to start reading today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item) => (
            <div
              key={item.step}
              className="relative flex flex-col bg-blaack rounded-2xl border border-slate-200/80 p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100">
                  {item.icon}
                </div>
                <span className="text-3xl font-extrabold tracking-tight text-slate-800">
                  {item.step}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>


        <div className="mt-12 text-center">
          <Link
            href="/all-books"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-600 hover:shadow-indigo-500/20 hover:shadow-md active:scale-[0.98]"
          >
            <span>Start Exploring Books</span>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BorrowingWorks;
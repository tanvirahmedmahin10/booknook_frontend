
import Image from 'next/image';

const reviews = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Avid Fiction Reader',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    title: 'Seamless borrowing experience',
    comment:
      'The book selection is top-notch and the turnaround time is incredible. Reserving a title and renewing online takes literally seconds.',
    borrowedBook: 'The Whispering Woods',
  },
  {
    id: 2,
    name: 'Marcus Chen',
    role: 'History Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    title: 'Saved me hundreds this year',
    comment:
      'Instead of buying books I only read once, this catalog lets me dive deep into my research without breaking the bank. Beautiful UI as well.',
    borrowedBook: 'The Silicon Blueprint',
  },
  {
    id: 3,
    name: 'Elena Rostova',
    role: 'Book Club Coordinator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    title: 'A true community gem',
    comment:
      'Our monthly book club gets all our recommendations directly from the curated lists here. The condition of the physical copies is always pristine.',
    borrowedBook: 'Quantum Echoes',
  },
];

const ReaderReviews = () => {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/10">
          Community Love
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          What Our Readers Say
        </h2>
        <p className="mt-3 text-base text-slate-600">
          Discover why thousands of avid readers and students rely on our library every single day.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="flex flex-col justify-between bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <div>

              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                &ldquo;{review.title}&rdquo;
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {review.comment}
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 shrink-0 overflow-hidden rounded-full border border-slate-100">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    {review.name}
                  </h4>
                  <p className="text-xs text-slate-500">{review.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <span className="font-medium text-slate-700">Borrowed:</span>
                <span className="italic truncate">{review.borrowedBook}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ReaderReviews;
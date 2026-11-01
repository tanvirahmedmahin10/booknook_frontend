'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { IBook } from '../all-books/[bookId]/page';

export default function BookSliderClient({ slides }: { slides: IBook[] }) {
  if (!slides || slides.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={slides.length > 1}
        className="rounded-2xl shadow-xl overflow-hidden"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide._id}>
            <div className="relative h-[400px] md:h-[450px] w-full flex items-center bg-slate-900">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40"
                style={{ backgroundImage: `url(${slide.cover_image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />

              <div className="relative z-10 max-w-xl p-8 md:p-12 text-white">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  {slide.title}
                </h2>
                <p className="text-slate-300 text-base md:text-lg mb-6 leading-relaxed">
                  {slide.description}
                </p>
                <Link
                  href="/all-books"
                  className="inline-block bg-primary hover:bg-primary-focus text-white font-medium px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-primary/25"
                >
                  Browse Books
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
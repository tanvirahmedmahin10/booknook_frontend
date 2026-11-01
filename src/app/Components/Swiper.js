'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function BookSlider() {
  
  const slides = [
    {
      id: 1,
      title: 'Explore Bestselling Novels',
      description: 'Dive into gripping mysteries, thrilling adventures, and award-winning fiction that will keep you hooked.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 2,
      title: 'Expand Your Knowledge',
      description: 'Discover top-rated non-fiction, self-improvement guides, and deep dives into science and history.',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 3,
      title: 'Immersive Sci-Fi & Fantasy',
      description: 'Journey through epic realms, futuristic worlds, and imaginative storytelling beyond your wildest dreams.',
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000&auto=format&fit=crop',
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        className="rounded-2xl shadow-xl overflow-hidden"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-[400px] md:h-[450px] w-full flex items-center bg-slate-900">
              {/* Background Image with Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />

              {/* Content Box */}
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
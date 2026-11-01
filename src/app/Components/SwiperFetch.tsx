import BookSliderClient from "./Swiper";

export default async function SwiperFetch() {
  const res = await fetch('http://localhost:8000/all-books');
  const books = await res.json();

  return <BookSliderClient slides={books} />;
}
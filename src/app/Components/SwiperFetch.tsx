import BookSliderClient from "./Swiper";

export default async function SwiperFetch() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/all-books`);
  const books = await res.json();

  return <BookSliderClient slides={books} />;
}
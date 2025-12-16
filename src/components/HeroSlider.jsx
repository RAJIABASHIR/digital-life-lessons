import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const HeroSlider = () => {
  const slides = [
    {
      title: "Capture the lessons that changed you",
      subtitle: "Record your personal insights before they fade away.",
      image:"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1800&q=80",
    },
    {
      title: "Learn from real stories",
      subtitle: "Explore wisdom shared by people around the world.",
      image:"https://timelinecovers.pro/facebook-cover/download/bench-in-morning-sunrise-facebook-cover.jpg",
    },
    {
      title: "Grow with mindful reflection",
      subtitle: "Track your growth and celebrate your progress.",
      image:"https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1800&q=80",
    },
  ];

  return (
    <Swiper
      modules={[Autoplay]}
      loop={true}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      slidesPerView={1}
      spaceBetween={0}
      className="w-full h-[70vh]"
    >
      {slides.map((s, idx) => (
        <SwiperSlide key={`${s.title}-${idx}`}>
          <div className="relative w-full h-[70vh] overflow-hidden">
            
            <img
              src={s.image}
              alt={s.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />

            
            <div className="absolute inset-0 bg-black/45" />

            
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
              <h1 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow">
                {s.title}
              </h1>
              <p className="max-w-2xl text-sm md:text-lg text-white/90 drop-shadow">
                {s.subtitle}
              </p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroSlider;
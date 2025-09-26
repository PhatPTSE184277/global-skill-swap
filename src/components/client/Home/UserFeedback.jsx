import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const feedbacks = [
  {
    text: "Teachings of the great explore of truth, the master-builder of human happiness. no one rejects,dislikes, or avoids pleasure itself, pleasure itself",
    name: "Finlay Kirk",
    avatar: "https://i.pravatar.cc/50?img=1",
  },
  {
    text: "Complete account of the system and expound the actual Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots",
    name: "Dannette P. Cervantes",
    avatar: "https://i.pravatar.cc/50?img=2",
  },
  {
    text: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour",
    name: "Clara R. Altman",
    avatar: "https://i.pravatar.cc/50?img=3",
  },
  {
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
    name: "Steven M. Barnes",
    avatar: "https://i.pravatar.cc/50?img=4",
  },
];

export default function UserFeedback() {
  return (
    <section className="pt-10 pb-25 bg-white">
      <h2 className="text-center text-3xl font-bold mb-12">
        <span className="text-orange-500">Phản Hồi</span> Của Người Dùng
      </h2>

      <div className="max-w-6xl mx-auto px-4">
        <Swiper
          modules={[Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{
            clickable: true,
            el: ".custom-swiper-pagination",
            bulletClass: "swiper-pagination-bullet !bg-gray-300",
            bulletActiveClass: "swiper-pagination-bullet-active !bg-purple-800",
          }}
          loop={false}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {feedbacks.map((fb, i) => (
            <SwiperSlide key={i}>
              <div className="bg-white rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.08)] p-6 h-[240px] flex flex-col justify-between hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-shadow duration-300">
                <p className="text-gray-600 italic line-clamp-4">{fb.text}</p>
                <div className="flex items-center gap-3">
                  <img
                    src={fb.avatar}
                    alt={fb.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-semibold text-gray-800">{fb.name}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

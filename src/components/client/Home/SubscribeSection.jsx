// SubscribeSection.jsx
import { useState } from "react";

export default function SubscribeSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      alert("Vui lòng nhập email");
      return;
    }
    // mock submit
    alert(`Đã đăng ký: ${email}`);
    setEmail("");
  };

  return (
    <section className="max-w-7xl mx-auto my-12">
      <div className="relative bg-purple-950 rounded-2xl py-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between ">
        {/* left text */}
        <div className="text-white  ">
          <p className=" text-3xl leading-snug px-15 py-4">
            Hãy để lại <span className="font-semibold">Email</span> để nhận{" "}
            <span className="text-orange-500 font-semibold">
              thông tin cập nhật mới nhất
            </span>{" "}
            từ chúng tôi.
          </p>
        </div>

        {/* form (white pill) */}
        <form
          onSubmit={handleSubmit}
          className="w-[500px] flex items-center bg-white rounded-full shadow-sm overflow-hidden"
          aria-label="Subscribe form"
        >
          <input
            aria-label="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email của bạn..."
            className="flex-1 px-6 py-3 text-gray-700 placeholder-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            className=" mr-1  bg-orange-500 hover:bg-orange-700 text-white font-medium px-7 py-2 rounded-full transition"
          >
            Đăng Ký
          </button>
        </form>
      </div>
    </section>
  );
}

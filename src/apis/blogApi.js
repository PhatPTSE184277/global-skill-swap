
const blogApi = {
  // Lấy danh sách bài viết đang theo dõi (Mock data)
  getFollowingPosts: async () => {
    // Giả lập delay API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      data: [
        {
          id: 1,
          image: "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg",
          alt: "Life in Japan",
          title: "Life In Japan: The Good, The Weird, And The Beautiful",
          description: "Did you come here looking for sakura trees or just daily vending machine surprises? Here's what living in Japan really feels like.",
          tags: ["Japan", "Life"],
          author: "Jenny Kiaa",
          date: "02 December 2022",
          readTime: 3,
        },
        {
          id: 2,
          image: "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg",
          alt: "Korean Culture",
          title: "Korean Etiquette That Surprised Me (And Almost Got Me in Trouble)",
          description: "Learning Korean culture the hard way - from awkward bowing mistakes to dining disasters.",
          tags: ["Korea", "Culture"],
          author: "Jenny Kiaa",
          date: "01 December 2022",
          readTime: 4,
        },
        {
          id: 5,
          image: "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg",
          alt: "Vietnam Street Food",
          title: "Exploring Vietnam Through Its Street Food",
          description: "From bánh mì to phở, here’s how street food tells the story of Vietnam’s culture.",
          tags: ["Vietnam", "Food"],
          author: "Jenny Kiaa",
          date: "28 November 2022",
          readTime: 6,
        }
      ]
    };
  },

  // Lấy danh sách bài viết đề xuất (Mock data)
  getSuggestedPosts: async () => {
    // Giả lập delay API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      data: [
        {
          id: 3,
          image: "https://images.pexels.com/photos/15861436/pexels-photo-15861436/free-photo-of-japan-and-germany-flag.jpeg",
          alt: "German Student Visa",
          title: "How I Got My German Student Visa - A Step-By-Step Reality Check",
          description: "From blocked accounts to weird embassy queues, here's my full experience applying for a student visa to Germany.",
          tags: ["Visa", "Guide"],
          author: "Jenny Kiaa",
          date: "02 December 2022",
          readTime: 3,
        },
        {
          id: 4,
          image: "https://images.pexels.com/photos/301614/pexels-photo-301614.jpeg",
          alt: "Study Abroad Tips",
          title: "10 Things I Wish I Knew Before Studying Abroad in Europe",
          description: "Essential tips and tricks that will save you time, money, and embarrassment during your study abroad journey.",
          tags: ["Study Abroad", "Europe"],
          author: "Jenny Kiaa",
          date: "30 November 2022",
          readTime: 5,
        },
        {
          id: 6,
          image: "https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg",
          alt: "Language Learning",
          title: "Why Learning Local Language Changes Everything Abroad",
          description: "Language is more than words—it’s a key to culture, friendship, and survival overseas.",
          tags: ["Language", "Abroad"],
          author: "Jenny Kiaa",
          date: "27 November 2022",
          readTime: 4,
        }
      ]
    };
  },

  // Lấy bài viết mới nhất (Mock data)
  getLatestPosts: async () => {
    // Giả lập delay API
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      data: [
        {
          id: 101,
          image: "https://images.pexels.com/photos/2101187/pexels-photo-2101187.jpeg",
          alt: "Working Part-Time in Japan",
          title: "The Truth About Working Part-Time In Japan As A Student",
          description: "Did you come here looking for sakura trees or just daily vending machine surprises? Here's what living in Japan really feels like.",
          tags: ["Japan", "Life"],
          author: "Jenny Kiaa",
          date: "02 December 2022",
          readTime: 3,
        },
        {
          id: 102,
          image: "https://images.pexels.com/photos/301614/pexels-photo-301614.jpeg",
          alt: "German Language Learning",
          title: "From B1 To C1: How I Improved My German While Studying In Berlin",
          description: "From blocked accounts to weird embassy queues, here's my full experience applying for a student visa to Germany.",
          tags: ["Germany", "Language"],
          author: "Jenny Kiaa",
          date: "02 December 2022",
          readTime: 3,
        }
      ]
    };
  },

  // Lấy bài viết nổi bật (mock luôn để test)
  getFeaturedPosts: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: 7,
          image: "https://images.pexels.com/photos/2101187/pexels-photo-2101187.jpeg",
          alt: "Japanese Work Culture",
          title: "The Truth About Japanese Work Culture",
          description: "Beyond the stereotypes of overwork and formality, here's the real picture.",
          tags: ["Japan", "Work"],
          author: "Jenny Kiaa",
          date: "25 November 2022",
          readTime: 5,
        }
      ]
    };
  },

  // Lấy bài viết hôm nay (mock luôn để test)
  getTodayPosts: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        {
          id: 8,
          image: "https://images.pexels.com/photos/267847/pexels-photo-267847.jpeg",
          alt: "Student Life",
          title: "Balancing Study and Part-Time Work Abroad",
          description: "Time management tips that saved me from burnout while studying overseas.",
          tags: ["Student", "Work"],
          author: "Jenny Kiaa",
          date: "Today",
          readTime: 4,
        }
      ]
    };
  }
};

export default blogApi;

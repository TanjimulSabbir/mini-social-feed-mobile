export interface PresetPost {
  title: string;
  content: string;
}

export const PRESET_POSTS: PresetPost[] = [
  {
    title: "🚀 Mastering Next.js Server Components",
    content:
      "Server Components changed the way we think about React applications. By moving heavy data fetching and rendering logic to the server, we can reduce client-side JavaScript and improve performance. The key is understanding what belongs on the server and what truly needs interactivity on the client.",
  },
  {
    title: "🎨 Tailwind CSS vs Traditional CSS",
    content:
      "Tailwind CSS is more than just utility classes. It encourages developers to think in terms of reusable design systems and consistent spacing. Once mastered, it can dramatically increase development speed while keeping UI components maintainable.",
  },
  {
    title: "⚡ The Future of React Native Development",
    content:
      "React Native continues to evolve with better architecture, improved performance, and stronger integration with native platforms. Expo has made mobile development accessible while still providing powerful native capabilities when needed.",
  },
  {
    title: "🤖 Artificial Intelligence and Software Engineering",
    content:
      "AI is not replacing software engineers; it is changing how engineers work. The future belongs to developers who can combine strong fundamentals with AI tools to build faster, smarter, and more reliable software systems.",
  },
  {
    title: "🧠 Clean Architecture in Modern Applications",
    content:
      "A good architecture is not about writing more folders or complex patterns. It is about separating responsibilities, keeping business logic independent, and making systems easier to understand, test, and evolve over time.",
  },
  {
    title: "🌌 The Odyssey: A Journey Beyond Adventure",
    content:
      "The Odyssey is not just a story about a hero returning home. It is a reflection of human struggles, identity, patience, temptation, and the endless search for meaning. Odysseus represents every person fighting through uncertainty to find their destination.",
  },
  {
    title: "🎬 Christopher Nolan's Approach to Storytelling",
    content:
      "Christopher Nolan creates experiences rather than simple movies. His storytelling often explores time, memory, human emotion, and philosophical questions. His films challenge audiences to think beyond what appears on the surface.",
  },
  {
    title: "🏛️ Greek Mythology and Human Psychology",
    content:
      "Ancient myths were not only entertainment; they were early attempts to understand human nature. Gods, heroes, monsters, and journeys represented our fears, desires, weaknesses, and ambitions.",
  },
  {
    title: "🧭 Why Humans Love Adventure Stories",
    content:
      "Adventure stories connect with something deeply human. They represent exploration, overcoming challenges, discovering unknown worlds, and pushing beyond ordinary limits.",
  },
  {
    title: "📚 Philosophy: The Search for Meaning",
    content:
      "Philosophy begins when humans start questioning existence itself. Why are we here? What makes a good life? What is truth? These questions have shaped civilizations for thousands of years.",
  },
  {
    title: "🌱 Growth Mindset in Software Engineering",
    content:
      "Great developers are not created by knowing every technology. They are created by curiosity, consistency, and the willingness to struggle through difficult problems until understanding emerges.",
  },
  {
    title: "🔥 Framer Motion and the Psychology of Animation",
    content:
      "Animations are not only visual effects. They communicate relationships, hierarchy, and feedback. The best animations feel natural because they follow principles inspired by real-world physics.",
  },
  {
    title: "💻 Understanding JavaScript Closures",
    content:
      "Closures are one of the most powerful concepts in JavaScript. They allow functions to remember their surrounding environment, enabling patterns like private variables, hooks, and advanced functional programming techniques.",
  },
  {
    title: "🔐 Why Security Matters in Software",
    content:
      "A feature is incomplete if it creates security risks. Authentication, authorization, data validation, encryption, and secure architecture are responsibilities every modern developer should understand.",
  },
  {
    title: "🌍 Human Evolution and Technology",
    content:
      "Technology is an extension of human creativity. From stone tools to artificial intelligence, every invention reflects our desire to solve problems, explore possibilities, and reshape the world around us.",
  },
  {
    title: "🪐 The Philosophy of Existentialism",
    content:
      "Existentialism explores freedom, responsibility, anxiety, and the search for meaning. Thinkers like Sartre and Camus questioned how humans create purpose in an uncertain universe.",
  },
  {
    title: "🎥 Cinema as an Art Form",
    content:
      "Movies are not just stories; they are combinations of visual language, music, performance, and emotion. Great cinema can change how we understand ourselves and the world.",
  },
  {
    title: "🌊 The Ocean and Human Curiosity",
    content:
      "The ocean represents one of humanity's greatest mysteries. Like space, it reminds us how much remains unknown and inspires exploration beyond our current boundaries.",
  },
  {
    title: "🚀 Building Products Instead of Just Writing Code",
    content:
      "Software engineering is not only about solving technical problems. Great engineers understand users, business goals, and human behavior to create products that actually matter.",
  },
  {
    title: "🧩 The Beauty of Problem Solving",
    content:
      "Programming is a creative discipline. Every bug, algorithm, and architecture decision is a puzzle that requires logic, patience, and imagination.",
  },
  {
    title: "🏔️ Mountains and the Human Spirit",
    content:
      "Mountains symbolize challenges and ambition. Every climb represents the human desire to overcome limits and discover what exists beyond the familiar.",
  },
  {
    title: "🧘 Stoicism and Modern Life",
    content:
      "Stoicism teaches us to focus on what we can control and accept what we cannot. Its principles remain surprisingly relevant in today's fast-changing world.",
  },
  {
    title: "🧬 The Story of Human Civilization",
    content:
      "Human civilization is a story of cooperation, conflict, innovation, and adaptation. Understanding history helps us understand where we came from and where we might go.",
  },
  {
    title: "☕ Developer Life: The Endless Learning Journey",
    content:
      "Technology never stops changing. A developer's career is built on continuous learning, experimentation, failure, and improvement.",
  },
  {
    title: "🌌 Space Exploration and Human Dreams",
    content:
      "Looking at the stars reminds humanity that exploration is part of our nature. Space represents curiosity, survival, and the possibility of discovering something greater than ourselves.",
  },
  {
    title: "⚔️ Heroes, Legends, and Reality",
    content:
      "Every hero story reflects human values like courage, sacrifice, and resilience. Legends survive because they reveal truths about human nature.",
  },
  {
    title: "🧠 Psychology Behind Human Decisions",
    content:
      "Human decisions are influenced by emotions, experiences, environment, and unconscious patterns. Understanding psychology helps us understand ourselves and others better.",
  },
  {
    title: "📱 Designing Better Mobile Experiences",
    content:
      "Great mobile apps are not only functional. They respect users' time, provide clear feedback, and create experiences that feel natural and effortless.",
  },
  {
    title: "🌿 Nature and Mental Peace",
    content:
      "Nature reminds us to slow down in a world dominated by notifications and constant information. Sometimes the simplest environments create the deepest thoughts.",
  },
  {
    title: "🕰️ Time: The Greatest Mystery",
    content:
      "Time is something every human experiences but nobody can fully explain. Our relationship with time shapes memories, decisions, and our understanding of existence.",
  },
];

/**
 * Generates a random preset post, avoiding the currently selected title.
 */
export function generateRandomPost(currentTitle?: string): PresetPost {
  const filteredPresets = PRESET_POSTS.filter((p) => p.title !== currentTitle);
  const pool = filteredPresets.length > 0 ? filteredPresets : PRESET_POSTS;
  const randomIndex = Math.floor(Math.random() * pool.length);

  return pool[randomIndex];
}

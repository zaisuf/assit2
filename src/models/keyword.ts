//lib/keyword.ts

import { KeywordRoute } from '@/lib/keyword';

// Define schema type for SEO
export interface KeywordSchema {
  "@context": "https://schema.org";
  "@type": "WebPage";
  name: string;
  description: string;
  url: string;
  image: string;
  keywords: string;
}

// Function to generate schema for each route
export function generateSchema(route: KeywordRoute): KeywordSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: route.title,
    description: route.description,
    url: `https://weblike.ai${route.url}`,
    image: `https://weblike.ai${route.image}`,
    keywords: route.keyword
  };
}

export const keywordRoutes: KeywordRoute[] = [
  {
    keyword: "ai-landing-page-builder",
    views: 45,
    url: "/weblikeai/ai-landing-page-builder",
    title: "🚀 Free AI Website Builder | Create Your Site Instantly",
    description: "Build professional websites for free using advanced AI technology",
    image: "/chat.png",
    category: "ai-landing-page-builder"
  },


  {
    keyword: "website-builder",
    views: 40,
    url: "/weblikeai/website-builder",
    title: "🎯 Create Modern website All in One ,AI theme,image,logo generator and more",
    description: "Create stunning websites and landing page  with zero coding using AI assistance",
    image: "/chat.png",
    category: "website-builder"
  },

  {
    keyword: "best-ai-website-builder",
    views: 35,
    url: "/weblikeai/best-ai-website-buildert",
    title: "🏆 Top AI Website Builders | Reddit's Favorites",
    description: "Community-recommended AI website builders for all skill levels",
    image: "/chat.png",
    category: "best-ai-website-buildert"
  },
  {
    keyword: "landing-page-design",
    views: 55,
    url: "/weblikeai/landing-page-design",
    title: "⭐ Build best landing page  no need designer ,no coding skill ",
    description: "Compare top-rated AI landing builders and choose the perfect one",
    image: "/chat.png",
    category: "landing-page-design"
  },
  {
    keyword: "ai-website-builder-2024",
    views: 48,
    url: "/weblikeai/ai-website-builder-2024",
    title: "💫 AI Website Builder Tools",
    description: "Build your dream website for free with AI assistance",
    image: "/chat.png",
    category: "ai-website-builder-2024"
  },
  {
    keyword: "website-builder-ai",
    views: 42,
    url: "/weblikeai/website-builder-ai",
    title: "🔧 AI-Powered Website Builder",
    description: "Create professional websites effortlessly with AI technology",
    image: "/chat.png",
    category: "website-builder-ai"
  },
  {
    keyword: "AI-drag-and-drop-website-builder",
    views: 42,
    url: "/weblikeai/AI-drag-and-drop-website-builder",
    title: "🔧 AI-Powered Drag and drop webiste builder ",
    description: "Build your website with unique theme and image layout ALL in ONe tool  ",
    image: "/chat.png",
    category: "buidler"
  },
  {
    keyword: "best-drag-and-drop-website-builder",
    views: 42,
    url: "/weblikeai/best-drag-and-drop-website-builder",
    title: "🔧 AI-Powered best drag and drop website builder ",
    description: "Create professional websites effortlessly with AI technology best drag and drop website builder",
    image: "/chat.png",
    category: "Drag-and-Drop"
  },
  {
    keyword: "website-builder-ai",
    views: 42,
    url: "/weblikeai/website-builder-ai",
    title: "🔧 AI-Powered Website Builder",
    description: "Create professional websites effortlessly with AI technology",
    image: "/chat.png",
    category: "free-tools"
  },
  {
    keyword: "drag-and-drop-website-builder-free",
    views: 42,
    url: "/weblikeai/drag-and-drop-website-builder-free",
    title: "🔧 drag and drop website builder free Build unique website with AI ",
    description: "Create professional website with Ai ",
    image: "/chat.png",
    category: "free-tools"
  },

  {
    keyword: "landing-page-design",
    views: 42,
    url: "/weblikeai/landing-page-design",
    title: "🔧 AI- landing page design Build Modern landing page With AI",
    description: "Create Modern landing page with theme,image,logo With All in one ",
    image: "/chat.png",
    category: "design"
  },
  {
    keyword: "how-to-create-a-landing-page",
    views: 42,
    url: "/weblikeai/how-to-create-a-landing-page",
    title: "🔧 Create landing page wiht no design skill need  ",
    description: "Create Ultra unique landing page with Ai ",
    image: "/chat.png",
    category: "tutorials"
  },
  {
    keyword: "best-landing-page-builder",
    views: 42,
    url: "/weblikeai/best-landing-page-builder",
    title: "🔧 AI-Powered Model create modern landing page",
    description: "Create with AI modern landing page with Ai ,Chat feature ",
    image: "/chat.png",
    category: "comparison"
  },
  {
    keyword: "improving-landing-page-performance",
    views: 42,
    url: "/weblikeai/improving-landing-page-performance",
    title: "🔧 Build landing page with Ai improve performance accrose global ",
    description: "Create Unique landing page with AI ,improve performance accross global",
    image: "/chat.png",
    category: "optimization"
  },
  {
    keyword: "website-landing-page",
    views: 42,
    url: "/weblikeai/website-landing-page",
    title: "🔧 Create website landing page",
    description: "Create modern landing page with AI Drag and drop features",
    image: "/chat.png",
    category: "marketing"
  },
  {
    keyword: "Landing-page-design",
    views: 42,
    url: "/weblikeai/Landing-page-design",
    title: "🔧 Create Premium  landing page design",
    description: "Create Premium landing page with All in one tool to build modern unique landing page",
    image: "/chat.png",
    category: "development"
  },

  {
    keyword: "how-to-create-landing-page-for-free",
    views: 42,
    url: "/weblikeai/how-to-create-landing-page-for-free",
    title: "🔧 create landing page with Ai ",
    description: "Create modern exclusive  landing page that match your brand",
    image: "/chat.png",
    category: "ai-tools"
  },
  {
    keyword: "how-to-create-landing-page-for-facebook-ad",
    views: 42,
    url: "/weblikeai/how-to-create-landing-page-for-facebook-ad",
    title: "🔧 create landing page for facebook ads ",
    description: "Create premium design landing page with no human need all unique created by AI, No-pre-made layout  ,",
    image: "/chat.png",
    category: "landing page builder"
  },


  {
    keyword: "how-to-create-landing-page",
    views: 42,
    url: "/weblikeai/how-to-create-landing-page",
    title: "🔧 Create  a ultra Unique landing page ",
    description: "No-design ,No human  ALl In one Ai tool create landing page,chat with ai to make changes",
    image: "/chat.png",
    category: "tools"
  },
  {
    keyword: "how-to-create-landing-page-for-website",
    views: 42,
    url: "/weblikeai/how-to-create-landing-page-for-website",
    title: "🔧 here is AI to create landing page for website",
    description: "Create professional websites like Company ,and startup  Use",
    image: "/chat.png",
    category: "tutorial"
  },
  {
    keyword: "how-to-create-landing-page-in-html",
    views: 42,
    url: "/weblikeai/how-to-create-landing-page-in-html",
    title: "🔧 Create landing page in html with AI ",
    description: "Create html landing page with Ai ,Unique theme ,Image ,logo ALL in One ",
    image: "/chat.png",
    category: "Ai-tools"
  },
  {
    keyword: "how-to-create-landing-page-in-weblike-theme",
    views: 42,
    url: "/weblikeai/how-to-create-landing-page-in-weblike-theme",
    title: "🔧 how to create landing page in weblikeai  theme",
    description: "Create  landing page in weblikeai a modern landing page Ai tools  ",
    image: "/chat.png",
    category: "tutorial"
  }, {
    keyword: "create-landing-page-with-ai",
    views: 42,
    url: "/weblikeai/create-landing-page-with-ai",
    title: "🔧 Create landing page with Ai ,Build fast ,unique ",
    description: "Create landing page with Ai ,Build fast ,unique a modern landing page Ai tools",
    image: "/chat.png",
    category: "tutorial"
  },
   {
    keyword: "ai-create-landing-page",
    views: 42,
    url: "/weblikeai/ai-create-landing-page",
    title: "🔧 Ai create landing page With AI unique theme ,image  ",
    description: "Ai create landing page For you modern customize as base your choice with Ai ",
    image: "/chat.png",
    category: "creator"
  },
  {
    keyword: "ai-image-generator",
    views: 42,
    url: "/weblikeai/ai-image-generator",
    title: "🔧 create stunning image with AI for your website perfect match for your brand",
    description: "create stunning image that need in your website All-in-one tools",
    image: "/chat.png",
    category: "Ai image generator"
  },
  {
    keyword: "ai-theme-generator",
    views: 42,
    url: "/weblikeai/ai-theme-generator",
    title: "🔧 Create beautiful Ai theme for your website ",
    description: "Create modern AI theme for your website Just with AI ",
    image: "/chat.png",
    category: "Ai"
  },
 
  {
    keyword: "ai-theme-generator-free",
    views: 42,
    url: "/weblikeai/ai-theme-generator-free",
    title: "🔧 Ai theme generator for your website ",
    description: "Create stunning theme with AI correctly fit your brand ",
    image: "/chat.png",
    category: "theme generator"
  },
  // Add more routes as needed
];

// Generate schema for all routes
export const keywordSchemas: KeywordSchema[] = keywordRoutes.map(generateSchema);





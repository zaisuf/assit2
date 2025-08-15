export interface JanBlog {
    id: number;
    title: string;
    summary: string;
    content: string;
    slug: string;
    image: string;
    publishDate: string;  // Add this field
    category: string;     // Add this if not already present
    buyNowLink?: string; // Optional field for the "Buy Now" button
  }
  const keywords = ["Assistlore", "Assistlore style with Ai", "Design houses with AI", ];
  export const janblog: JanBlog[] = [
  
    {
      "id": 1,
      "title": `Build Beautiful Landing Pages in Minutes: Drag & Drop React Builder Made Simple`,
      "summary": "Quickly create stunning landing pages with an easy-to-use drag-and-drop for React no coding required",
      "content": `
 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Drag and Drop React Landing Page Maker: Free & Human-Friendly</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --background: #111111;
            --surface: #1a1a1a;
            --text: #ffffff;
            --text-secondary: #a0a0a0;
            --accent: #ffffff;
            --border: #333333;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--background);
            color: var(--text);
            line-height: 1.6;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1.5rem;
        }

        .hero {
            height: 70vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            border-bottom: 1px solid var(--border);
        }

        .hero-content {
            text-align: center;
            max-width: 800px;
        }

        .title {
            font-size: 3.5rem;
            font-weight: 300;
            letter-spacing: -1px;
            margin-bottom: 1.5rem;
            color: var(--text);
        }

        .subtitle {
            font-size: 1.25rem;
            color: var(--text-secondary);
            font-weight: 300;
        }

        .article-container {
            display: block;
            max-width: 800px;
            margin: 4rem auto;
        }

        .content {
            font-size: 1.125rem;
            text-align: center;
        }

        .content h2 {
            font-size: 2rem;
            font-weight: 300;
            margin: 3rem 0 1.5rem;
            letter-spacing: -0.5px;
        }

        .content p {
            margin-bottom: 1.5rem;
            color: var(--text-secondary);
        }

        .newsletter {
            margin: 6rem 0;
            padding: 4rem 2rem;
            border: 1px solid var(--border);
            text-align: center;
        }

        .newsletter-input {
            width: 100%;
            max-width: 400px;
            padding: 1rem;
            margin: 1.5rem 0;
            background: transparent;
            border: 1px solid var(--border);
            color: var(--text);
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }

        .newsletter-input:focus {
            outline: none;
            border-color: var(--text);
        }

        .newsletter-button {
            background: var(--text);
            color: var(--background);
            border: none;
            padding: 1rem 2rem;
            font-size: 0.9rem;
            cursor: pointer;
            transition: opacity 0.3s ease;
        }

        .newsletter-button:hover {
            opacity: 0.9;
        }

        @media (max-width: 768px) {
            .article-container {
                grid-template-columns: 1fr;
            }

            .title {
                font-size: 2.5rem;
            }

            .sidebar {
                position: relative;
                margin-top: 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="hero">
        <div class="hero-content">
            <h1 class="title">Drag and Drop React Landing Page Maker</h1>
            <p class="subtitle">Free, Human-Friendly, and Intuitive Design Tools</p>
        </div>
    </div>
  <figure>
        <img src="/blog-React-Drag-and-drop.png" alt="Future of Drag-and-Drop Design Tools" class="rounded-lg">
        <figcaption class="text-center text-sm text-gray-600 mt-2">The future of drag-and-drop tools is bright and full of possibilities</figcaption>
    </figure>
    <div class="container">
        <div class="article-container">
            <main class="content">
                <article>
                    <section id="introduction">
                        <h2>Introduction</h2>
                        <p>Creating stunning landing pages has never been easier, thanks to drag-and-drop React-based tools. These free, human-friendly platforms empower users to design professional websites without coding knowledge...</p>
                    </section>
                    
                    <section id="what-is-drag-and-drop">
                        <h2>What is a Drag-and-Drop React Landing Page Maker?</h2>
                        <p>
                            A drag-and-drop React landing page maker is a tool that allows users to create fully functional and responsive landing pages by simply dragging and dropping components. Built on React, these tools offer flexibility, speed, and ease of use.
                        </p>
                        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                            <p class="font-semibold">Key Features:</p>
                            <ul>
                                <li>Pre-built React Components</li>
                                <li>Real-time Preview</li>
                                <li>Customizable Templates</li>
                                <li>Mobile Responsiveness</li>
                                <li>Free to Use</li>
                            </ul>
                        </div>
                    </section>

                    <section id="benefits">
                        <h2>Benefits of Using Drag-and-Drop Tools</h2>
                        <p>
                            These tools are designed to make web design accessible to everyone. Here are some of the key benefits:
                        </p>
                        <div class="grid md:grid-cols-2 gap-6 my-6">
                            <div class="bg-white p-6 rounded-lg shadow">
                                <h3 class="text-xl font-semibold mb-2">No Coding Required</h3>
                                <p>Anyone can create a landing page without writing a single line of code.</p>
                            </div>
                            <div class="bg-white p-6 rounded-lg shadow">
                                <h3 class="text-xl font-semibold mb-2">Time-Saving</h3>
                                <p>Design and deploy landing pages in minutes, not days.</p>
                            </div>
                        </div>
                    </section>

                    <section id="challenges">
                        <h2>Challenges and Limitations</h2>
                        <p>
                            While drag-and-drop tools are incredibly user-friendly, they do come with some limitations:
                        </p>
                        <ul>
                            <li>Limited Customization for Advanced Users</li>
                            <li>Dependency on Pre-built Components</li>
                            <li>Performance Optimization</li>
                            <li>Learning Curve for Non-Designers</li>
                        </ul>
                    </section>

                    <section id="future">
    <h2>The Future of Drag-and-Drop Design Tools</h2>
    <p>
        As technology advances, drag-and-drop tools are expected to become even more powerful and intuitive. Here are some trends to watch:
    </p>
    
    <!-- YouTube Video Embed -->
    <div class="video-container my-6" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
        <iframe 
            src="https://www.youtube.com/embed/sj9xzNciZ_8" 
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 8px;"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
        </iframe>
    </div>

  
</section>

                    <section id="conclusion">
                        <h2>Conclusion</h2>
                        <p>Drag-and-drop React landing page makers are revolutionizing web design, making it accessible, efficient, and enjoyable for everyone...</p>
                    </section>
                </article>
            </main>
        </div>

       <div class="cta-section" style="text-align: center; padding: 3rem; background: linear-gradient(135deg, #1a1a1a, #2c3e50); border-radius: 12px; color: white; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);">
    <h2 style="font-weight: 600; font-size: 2.5rem; margin-bottom: 1rem; background: linear-gradient(45deg, #00d2ff, #3a7bd5); -webkit-background-clip: text; color: transparent;">
        Ready to Build Stunning landing page
    </h2>
    <p style="font-size: 1.2rem; margin-bottom: 2rem; color: rgba(255, 255, 255, 0.8);">
        Unlock the power of AI Builder and create Stunning landing page effortlessly.
    </p>
    <a href="/signup" style="text-decoration: none;">
        <button 
            style="background: linear-gradient(45deg, #00d2ff, #3a7bd5); color: white; border: none; padding: 1rem 2.5rem; font-size: 1.1rem; font-weight: 600; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0, 210, 255, 0.3);"
            onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 20px rgba(0, 210, 255, 0.5)';"
            onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 15px rgba(0, 210, 255, 0.3)';"
        >
            Start Building 
        </button>
    </a>
</div>
    </div>
</body>
</html>
      `,
      "slug": "Drag-and-drop-react-landing-page-maker",
      "image": "/blog-React-Drag-and-drop.png",
      "publishDate": "9/1/2025", // Add this field
      "category": "design"     // Add this field
  
    },


    
  
  
    // Add more blog posts here
  ];
  

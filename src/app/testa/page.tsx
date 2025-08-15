"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// Define custom font families for easy use with Tailwind
const fontAetherion = { fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "-0.05em" };
const fontBody = { fontFamily: "'Inter', sans-serif" };

const AetherionPage = () => {
  const heroCanvasContainerRef = useRef<HTMLDivElement>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // --- 3D Hero Object ---
    if (heroCanvasContainerRef.current) {
      const container = heroCanvasContainerRef.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      container.appendChild(renderer.domElement);

      const geometry = new THREE.IcosahedronGeometry(1.8, 0);
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.6,
        roughness: 0.3,
        wireframe: true,
      });
      const shape = new THREE.Mesh(geometry, material);
      scene.add(shape);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
      scene.add(ambientLight);
      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);

      camera.position.z = 5;

      let mouseX = 0, mouseY = 0;
      const handleMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      };
      document.addEventListener('mousemove', handleMouseMove);

      const animate = () => {
        requestAnimationFrame(animate);
        shape.rotation.x += 0.001;
        shape.rotation.y += 0.001;
        shape.rotation.y += (mouseX * 0.5 - shape.rotation.y) * 0.05;
        shape.rotation.x += (mouseY * 0.5 - shape.rotation.x) * 0.05;
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
      };
      window.addEventListener('resize', handleResize);
      
      // GSAP animation for the 3D shape
      gsap.to(shape.position, {
        z: -2,
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        }
      });
      
      // Cleanup on component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('mousemove', handleMouseMove);
        container.removeChild(renderer.domElement);
      };
    }
  }, []);

  useEffect(() => {
    // Using a context for GSAP animations for easier cleanup
    const ctx = gsap.context(() => {
      // --- Horizontal Scrolling ---
      if (horizontalScrollRef.current) {
        const horizontalSection = horizontalScrollRef.current;
        gsap.to(horizontalSection, {
          x: () => -(horizontalSection.scrollWidth - document.documentElement.clientWidth) + "px",
          ease: "none",
          scrollTrigger: {
            trigger: horizontalSection,
            start: "top top",
            end: () => "+=" + (horizontalSection.scrollWidth - document.documentElement.clientWidth),
            scrub: true,
            pin: true,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          }
        });
      }

      // --- General Animations ---
      gsap.from(".bento-item", {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".bento-grid",
          start: "top 80%",
        }
      });

      gsap.from(".testimonial-card", {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".testimonial-card",
          start: "top 85%",
        }
      });

    }, mainContainerRef); // scope animations to the main container

    return () => ctx.revert(); // cleanup
  }, []);

  return (
    <div ref={mainContainerRef} className="antialiased bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full p-6 z-50">
        <div className="container mx-auto flex justify-between items-center text-white">
          <div className="text-2xl" style={fontAetherion}>Aetherion</div>
          <nav className="hidden md:flex items-center space-x-8 bg-black/30 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2">
            <a href="#features" className="text-sm hover:opacity-75 transition-opacity" style={fontBody}>Features</a>
            <a href="#process" className="text-sm hover:opacity-75 transition-opacity" style={fontBody}>Process</a>
            <a href="#start" className="text-sm hover:opacity-75 transition-opacity" style={fontBody}>Start</a>
          </nav>
          <button className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-opacity-80 transition-all" style={fontBody}>
            Launch Your Store
          </button>
        </div>
      </header>
      
      <main>
        {/* Hero Section with 3D Object */}
        <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
          <div 
            ref={heroCanvasContainerRef} 
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.5,
              background: 'radial-gradient(ellipse at 50% 50%, rgba(120, 120, 120, 0.1) 0%, rgba(10, 10, 10, 0) 70%)'
            }}
          />
          <div className="relative z-10 p-4">
            <h1 className="text-6xl md:text-9xl leading-none" style={fontAetherion}>
              <span className="block">Design.</span>
              <span className="block">Deploy.</span>
              <span className="block">Dominate.</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-400" style={fontBody}>
              The definitive platform for ambitious brands to forge their digital commerce empire.
            </p>
          </div>
        </section>

        {/* Marquee Section */}
        <section className="py-12 bg-[#111111]">
          <div className="marquee whitespace-nowrap overflow-hidden">
            <div className="marquee-content inline-block">
              {[...Array(6)].map((_, i) => (
                <React.Fragment key={i}>
                  <span className="text-2xl mx-8 text-gray-600" style={fontAetherion}>Innovate</span>
                  <span className="text-2xl mx-8 text-gray-600" style={fontAetherion}>Create</span>
                  <span className="text-2xl mx-8 text-gray-600" style={fontAetherion}>Scale</span>
                  <span className="text-2xl mx-8 text-gray-600" style={fontAetherion}>Thrive</span>
                  <span className="text-2xl mx-8 text-gray-600" style={fontAetherion}>Lead</span>
                  <span className="text-2xl mx-8 text-gray-600" style={fontAetherion}>Succeed</span>
                </React.Fragment>
              ))}
            </div>
            <div className="marquee-content inline-block">
               {[...Array(6)].map((_, i) => (
                <React.Fragment key={i}>
                  <span className="text-2xl mx-8 text-gray-600" style={fontAetherion}>Innovate</span>
                  <span className="text-2xl mx-8 text-gray-600" style={fontAetherion}>Create</span>
                  <span className="text-2xl mx-8 text-gray-600" style={fontAetherion}>Scale</span>
                  <span className="text-2xl mx-8 text-gray-600" style={fontAetherion}>Thrive</span>
                  <span className="text-2xl mx-8 text-gray-600" style={fontAetherion}>Lead</span>
                  <span className="text-2xl mx-8 text-gray-600" style={fontAetherion}>Succeed</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* Horizontal Scrolling Section */}
        <section id="features" className="relative h-screen overflow-hidden">
            <div ref={horizontalScrollRef} className="flex items-center h-full" style={{ width: '400vw' }}>
                <div className="horizontal-scroll-section flex">
                    {/* Panel 1 */}
                    <div className="w-screen h-screen flex items-center justify-center p-8 md:p-16">
                        <div className="text-center">
                            <h2 className="text-5xl md:text-7xl" style={fontAetherion}>A Process, Perfected.</h2>
                            <p className="mt-4 max-w-xl mx-auto text-lg text-gray-400">We've streamlined the path from idea to global marketplace.</p>
                        </div>
                    </div>
                    {/* Panel 2 */}
                    <div className="w-screen h-screen flex items-center justify-center p-8 md:p-16">
                        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <img src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2070&auto=format&fit=crop" className="rounded-3xl object-cover h-[500px] w-full" alt="UI Design" />
                            <div>
                                <span className="text-8xl text-gray-700" style={fontAetherion}>01</span>
                                <h3 className="text-4xl mt-2" style={fontAetherion}>Visual Builder</h3>
                                <p className="mt-4 text-gray-400">Craft a bespoke storefront with an intuitive drag-and-drop editor. Your brand's vision, realized without compromise.</p>
                            </div>
                        </div>
                    </div>
                    {/* Panel 3 */}
                    <div className="w-screen h-screen flex items-center justify-center p-8 md:p-16">
                        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <img src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1974&auto=format&fit=crop" className="rounded-3xl object-cover h-[500px] w-full" alt="Payments" />
                            <div>
                                <span className="text-8xl text-gray-700" style={fontAetherion}>02</span>
                                <h3 className="text-4xl mt-2" style={fontAetherion}>Unified Commerce</h3>
                                <p className="mt-4 text-gray-400">Integrate payments, inventory, and logistics into a single, intelligent system that scales with you.</p>
                            </div>
                        </div>
                    </div>
                    {/* Panel 4 */}
                    <div className="w-screen h-screen flex items-center justify-center p-8 md:p-16">
                        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <img src="https://images.unsplash.com/photo-1590412858934-3d0f0a85df8a?q=80&w=1964&auto=format&fit=crop" className="rounded-3xl object-cover h-[500px] w-full" alt="Global Network" />
                            <div>
                                <span className="text-8xl text-gray-700" style={fontAetherion}>03</span>
                                <h3 className="text-4xl mt-2" style={fontAetherion}>Global Deployment</h3>
                                <p className="mt-4 text-gray-400">Launch on a global edge network. Deliver unparalleled speed and reliability to every customer, everywhere.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Bento Grid Features */}
        <section id="process" className="py-20 md:py-40 bg-[#0A0A0A]">
            <div className="container mx-auto px-6">
                <div className="text-left mb-16 max-w-2xl">
                    <h2 className="text-4xl md:text-6xl" style={fontAetherion}>The Complete Toolkit.</h2>
                    <p className="mt-4 text-lg text-gray-400" style={fontBody}>
                        Everything you need, nothing you don't. Our feature set is built for performance and scale.
                    </p>
                </div>
                <div className="bento-grid grid grid-cols-8 grid-auto-rows-[minmax(100px,auto)] gap-6">
                    <div className="bento-item col-span-5 row-span-3 flex flex-col justify-end p-8 rounded-3xl border border-[#282828] bg-[#141414] transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl overflow-hidden" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')`, backgroundSize: 'cover' }}>
                        <h3 className="text-4xl" style={fontAetherion}>AI-Powered Analytics</h3>
                        <p className="text-gray-300 max-w-md mt-2" style={fontBody}>Go beyond data. Get predictive insights on trends, customer behavior, and inventory forecasting.</p>
                    </div>
                    <div className="bento-item col-span-3 row-span-2 flex flex-col justify-between p-6 rounded-3xl border border-[#282828] bg-[#141414] transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl">
                        <h3 className="text-2xl" style={fontAetherion}>Headless APIs</h3>
                        <div>
                            <p className="text-gray-400" style={fontBody}>Total creative freedom for developers.</p>
                        </div>
                    </div>
                    <div className="bento-item col-span-3 row-span-2 flex flex-col justify-between p-6 rounded-3xl border border-[#282828] bg-[#141414] transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl">
                        <h3 className="text-2xl" style={fontAetherion}>Global Tax & Compliance</h3>
                        <div>
                            <p className="text-gray-400" style={fontBody}>Automated to keep you focused on growth.</p>
                        </div>
                    </div>
                    <div className="bento-item col-span-2 row-span-1 flex items-center justify-center p-6 rounded-3xl border border-[#282828] bg-[#141414] transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl">
                        <p className="text-2xl" style={fontAetherion}>99.99% Uptime</p>
                    </div>
                    <div className="bento-item col-span-3 row-span-2 flex flex-col justify-end p-8 rounded-3xl border border-[#282828] bg-[#141414] transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2070&auto=format&fit=crop')`, backgroundSize: 'cover' }}>
                        <h3 className="text-3xl" style={fontAetherion}>24/7 Priority Support</h3>
                        <p className="text-gray-300 max-w-md mt-2" style={fontBody}>Expert help is always available, no matter your timezone.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-40 bg-[#111111]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl" style={fontAetherion}>Trusted by Visionaries.</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Testimonial Cards */}
                    <div className="testimonial-card p-8 rounded-2xl border border-[#333]" style={{ background: 'linear-gradient(145deg, #1e1e1e, #181818)', boxShadow: '8px 8px 16px #0d0d0d, -8px -8px 16px #1f1f1f' }}>
                        <p className="text-gray-300" style={fontBody}>"Aetherion transformed our entire go-to-market strategy. The speed and creative control are unparalleled."</p>
                        <div className="mt-6 flex items-center">
                            <img src="https://i.pravatar.cc/48?u=1" className="w-12 h-12 rounded-full" alt="Jasmine Carr" />
                            <div className="ml-4">
                                <p className="font-bold">Jasmine Carr</p>
                                <p className="text-sm text-gray-500">CEO, Solara</p>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-card p-8 rounded-2xl md:mt-12 border border-[#333]" style={{ background: 'linear-gradient(145deg, #1e1e1e, #181818)', boxShadow: '8px 8px 16px #0d0d0d, -8px -8px 16px #1f1f1f' }}>
                        <p className="text-gray-300" style={fontBody}>"We migrated from a legacy platform and our conversion rate doubled. The performance is just on another level."</p>
                        <div className="mt-6 flex items-center">
                            <img src="https://i.pravatar.cc/48?u=2" className="w-12 h-12 rounded-full" alt="Leo Martinez" />
                            <div className="ml-4">
                                <p className="font-bold">Leo Martinez</p>
                                <p className="text-sm text-gray-500">CTO, Nomad Goods</p>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-card p-8 rounded-2xl border border-[#333]" style={{ background: 'linear-gradient(145deg, #1e1e1e, #181818)', boxShadow: '8px 8px 16px #0d0d0d, -8px -8px 16px #1f1f1f' }}>
                        <p className="text-gray-300" style={fontBody}>"The developer experience is incredible. The headless API gave our team the flexibility we've always dreamed of."</p>
                        <div className="mt-6 flex items-center">
                            <img src="https://i.pravatar.cc/48?u=3" className="w-12 h-12 rounded-full" alt="Kenna Hamid" />
                            <div className="ml-4">
                                <p className="font-bold">Kenna Hamid</p>
                                <p className="text-sm text-gray-500">Lead Dev, Orbit</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Final CTA Section */}
        <section id="start" className="relative py-20 md:py-40 bg-white text-black">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-5xl md:text-8xl" style={fontAetherion}>Build Your Legacy.</h2>
                <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-2xl mx-auto" style={fontBody}>
                    The future of commerce is in your hands. Start your free 14-day trial and experience the Aetherion difference.
                </p>
                <div className="mt-10">
                    <button className="px-10 py-5 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all text-lg" style={fontBody}>
                        Start Building For Free
                    </button>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black py-20">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8 text-gray-400">
            <div className="col-span-2 md:col-span-1">
                <h3 className="text-2xl text-white" style={fontAetherion}>Aetherion</h3>
            </div>
            {['Product', 'Resources', 'Company', 'Legal'].map(title => (
                <div key={title}>
                    <h4 className="font-bold text-white mb-4">{title}</h4>
                    <ul className="space-y-2 text-sm">
                        {title === 'Product' && ['Features', 'Pricing', 'Updates', 'API'].map(item => <li key={item}><a href="#" className="hover:text-white">{item}</a></li>)}
                        {title === 'Resources' && ['Blog', 'Case Studies', 'Help Center', 'Guides'].map(item => <li key={item}><a href="#" className="hover:text-white">{item}</a></li>)}
                        {title === 'Company' && ['About Us', 'Careers', 'Contact'].map((item) => <li key={item}><a href="#" className="hover:text-white">{item}</a></li>)}
                        {title === 'Legal' && ['Privacy', 'Terms'].map(item => <li key={item}><a href="#" className="hover:text-white">{item}</a></li>)}
                    </ul>
                </div>
            ))}
        </div>
        <div className="container mx-auto px-6 mt-16 border-t border-gray-800 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2025 Aetherion. A New Era of Commerce.</p>
        </div>
      </footer>
    </div>
  );
};

export default AetherionPage;
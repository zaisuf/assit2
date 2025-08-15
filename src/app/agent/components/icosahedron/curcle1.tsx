"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HeroIcosahedron: React.FC = () => {
  const heroCanvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroCanvasContainerRef.current) {
      const container = heroCanvasContainerRef.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        110, // even wider FOV
        container.offsetWidth / container.offsetHeight,
        0.1,
        1000
      );

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      container.appendChild(renderer.domElement);

      // Green wireframe icosahedron, smooth and circular
      const geometry = new THREE.IcosahedronGeometry(40, 4); // much larger radius
      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x7fff99,
        wireframe: true,
      });
      const shape = new THREE.Mesh(geometry, wireframeMaterial);
      scene.add(shape);

      // No lights needed for MeshBasicMaterial
      camera.position.z = 1.1;
      // Keep scene background transparent
      scene.background = null;

      let mouseX = 0, mouseY = 0;
      const handleMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      };
      document.addEventListener("mousemove", handleMouseMove);

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
      window.addEventListener("resize", handleResize);

      gsap.to(shape.position, {
        z: -2,
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      return () => {
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("mousemove", handleMouseMove);
        container.removeChild(renderer.domElement);
      };
    }
  }, []);

  return (
    <div
      ref={heroCanvasContainerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        opacity: 1,
        background: "transparent",
      }}
    />
  );
};

export default HeroIcosahedron;

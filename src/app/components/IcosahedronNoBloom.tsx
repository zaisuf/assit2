"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const IcosahedronNoBloom: React.FC = () => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvasContainerRef.current) {
      const container = canvasContainerRef.current;
      const scene = new THREE.Scene();
      scene.background = null;
      const camera = new THREE.PerspectiveCamera(
        75,
        container.offsetWidth / container.offsetHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      renderer.setClearColor(0x000000, 0); // fully transparent
      container.appendChild(renderer.domElement);
      renderer.domElement.style.background = "transparent";

      // Use higher detail for a more spherical, web-like look
      const geometry = new THREE.IcosahedronGeometry(18, 10);
      // Create edges geometry for lines
      const edges = new THREE.EdgesGeometry(geometry);
      // Use pure white for all lines
      const whiteColors = [];
      for (let i = 0; i < edges.attributes.position.count; i++) {
        whiteColors.push(1, 1, 1);
      }
      edges.setAttribute('color', new THREE.Float32BufferAttribute(whiteColors, 3));
      // Main white glowing lines
      const lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true, linewidth: 2, opacity: 1, transparent: true });
      const lineSegments = new THREE.LineSegments(edges, lineMaterial);
      scene.add(lineSegments);
      // Glow overlay
      const glowMaterial = new THREE.LineBasicMaterial({ vertexColors: true, linewidth: 18, opacity: 0.5, transparent: true });
      const glowLines = new THREE.LineSegments(edges, glowMaterial);
      glowLines.position.copy(lineSegments.position);
      glowLines.rotation.copy(lineSegments.rotation);
      scene.add(glowLines);

      // Optional: add a subtle ambient light for background
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
      scene.add(ambientLight);

      // Add a glowing point light at the center for a "motherhood" core effect
      const coreLight = new THREE.PointLight(0xffffff, 3, 100);
      coreLight.position.set(0, 0, 0);
      scene.add(coreLight);

      camera.position.z = 5;

      let mouseX = 0,
        mouseY = 0;
      const handleMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      };
      document.addEventListener("mousemove", handleMouseMove);

      const animate = () => {
        requestAnimationFrame(animate);
        lineSegments.rotation.x += 0.001;
        lineSegments.rotation.y += 0.001;
        lineSegments.rotation.y += (mouseX * 0.5 - lineSegments.rotation.y) * 0.05;
        lineSegments.rotation.x += (mouseY * 0.5 - lineSegments.rotation.x) * 0.05;
        // Sync glow lines rotation
        glowLines.rotation.copy(lineSegments.rotation);
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("mousemove", handleMouseMove);
        container.removeChild(renderer.domElement);
      };
    }
  }, []);

  return (
    <div
      ref={canvasContainerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        opacity: 1,
        background: "transparent"
      }}
    />
  );
};

export default IcosahedronNoBloom;

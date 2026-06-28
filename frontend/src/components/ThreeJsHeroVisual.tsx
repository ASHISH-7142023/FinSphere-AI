"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeJsHeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Create Scene, Camera, WebGLRenderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00c896, 5, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00e5ff, 3, 50);
    pointLight2.position.set(-5, -5, 3);
    scene.add(pointLight2);

    // Canvas textures for Credit Card
    const createCardFrontTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 324;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      // Background Gradient
      const grad = ctx.createLinearGradient(0, 0, 512, 324);
      grad.addColorStop(0, "#060f0b");
      grad.addColorStop(0.5, "#0a2217");
      grad.addColorStop(1, "#113824");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 324);

      // Tech vector curves
      ctx.strokeStyle = "rgba(0, 200, 150, 0.18)";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(420, 100, 120, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(440, 120, 220, 0, Math.PI * 2); ctx.stroke();

      // Glowing grid
      ctx.strokeStyle = "rgba(0, 200, 150, 0.08)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 512; i += 30) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i - 40, 324); ctx.stroke();
      }

      // Brand Logo symbol (double ring)
      ctx.fillStyle = "#00c896";
      ctx.beginPath(); ctx.arc(50, 55, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#060f0b";
      ctx.beginPath(); ctx.arc(44, 50, 9, 0, Math.PI * 2); ctx.fill();

      // Brand text
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px 'Outfit', 'Inter', sans-serif";
      ctx.fillText("FinSphere AI", 80, 62);

      // Gold Chip visual
      const chipGrad = ctx.createLinearGradient(45, 105, 95, 140);
      chipGrad.addColorStop(0, "#ffd700");
      chipGrad.addColorStop(1, "#b8860b");
      ctx.fillStyle = chipGrad;
      ctx.beginPath();
      // Draw chip with rounded corners
      if (ctx.roundRect) ctx.roundRect(45, 105, 48, 32, 5);
      else ctx.rect(45, 105, 48, 32);
      ctx.fill();
      // Chip grid lines
      ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(69, 105); ctx.lineTo(69, 137);
      ctx.moveTo(45, 121); ctx.lineTo(93, 121);
      ctx.stroke();

      // Card Numbers
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = "18px monospace";
      ctx.fillText("4421  7281  9012  4890", 45, 200);

      // Card Holder
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText("CARDHOLDER", 45, 250);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("ALEX STERLING", 45, 270);

      // Tier/Network Brand
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText("TIER STATUS", 370, 250);
      ctx.fillStyle = "#00c896";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("PLATINUM ELITE", 370, 270);

      return new THREE.CanvasTexture(canvas);
    };

    const createCardBackTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 324;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      // Dark background
      ctx.fillStyle = "#050907";
      ctx.fillRect(0, 0, 512, 324);

      // Magnetic Strip
      ctx.fillStyle = "#111111";
      ctx.fillRect(0, 30, 512, 55);

      // Signature Panel
      ctx.fillStyle = "#e0e0e0";
      ctx.fillRect(40, 115, 300, 35);
      
      // Signature text
      ctx.fillStyle = "#1e2c24";
      ctx.font = "italic 14px sans-serif";
      ctx.fillText("Alex Sterling", 55, 137);

      // CVV
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(340, 115, 45, 35);
      ctx.fillStyle = "#000000";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("421", 350, 137);

      // Informative text
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.font = "7px sans-serif";
      ctx.fillText("This card remains property of FinSphere AI. Authorized signatures only.", 40, 190);
      ctx.fillText("For customer assistance call +1 (555) 012-3456 or mail support@sphere.ai.", 40, 205);

      return new THREE.CanvasTexture(canvas);
    };

    const frontTexture = createCardFrontTexture();
    const backTexture = createCardBackTexture();

    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a1611,
      metalness: 0.9,
      roughness: 0.1,
    });

    const frontMaterial = new THREE.MeshStandardMaterial({
      map: frontTexture || undefined,
      metalness: 0.7,
      roughness: 0.25,
    });

    const backMaterial = new THREE.MeshStandardMaterial({
      map: backTexture || undefined,
      metalness: 0.6,
      roughness: 0.3,
    });

    // Multi-Material Array
    const materials = [
      edgeMaterial,  // pos-x
      edgeMaterial,  // neg-x
      edgeMaterial,  // pos-y
      edgeMaterial,  // neg-y
      frontMaterial, // pos-z
      backMaterial,  // neg-z
    ];

    // Card Mesh
    const cardGeometry = new THREE.BoxGeometry(3.5, 2.2, 0.06);
    const card = new THREE.Mesh(cardGeometry, materials);
    scene.add(card);

    // Floating Glassy Emerald Bubbles
    const sphereGroup = new THREE.Group();
    const sphereGeometry = new THREE.SphereGeometry(0.35, 32, 32);
    const sphereMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00c896,
      transparent: true,
      opacity: 0.45,
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.7,
      ior: 1.45,
      thickness: 0.4,
    });

    const sphereCount = 14;
    for (let i = 0; i < sphereCount; i++) {
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      
      const angle = (i / sphereCount) * Math.PI * 2;
      const radius = 2.5 + Math.random() * 1.5;
      
      sphere.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 3
      );
      
      const scaleVal = Math.random() * 0.6 + 0.3;
      sphere.scale.setScalar(scaleVal);
      
      sphere.userData = {
        speed: Math.random() * 0.005 + 0.002,
        offset: Math.random() * Math.PI * 2,
        radius: radius,
        angle: angle,
      };
      
      sphereGroup.add(sphere);
    }
    scene.add(sphereGroup);

    // Particle system (Dust/Glow)
    const particleCount = 80;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00c896,
      size: 0.05,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    camera.position.z = 4.8;

    // Mouse Tracking
    const mouse = new THREE.Vector2();
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let animationFrameId = 0;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Animate Card with Mouse lerping
      card.rotation.y = THREE.MathUtils.lerp(card.rotation.y, mouse.x * 0.8, 0.08);
      card.rotation.x = THREE.MathUtils.lerp(card.rotation.x, -mouse.y * 0.6, 0.08);
      card.position.y = Math.sin(Date.now() * 0.0012) * 0.08;

      // Animate Emerald Bubbles
      sphereGroup.children.forEach((obj) => {
        const sphere = obj as THREE.Mesh;
        const data = sphere.userData;
        
        // Circular orbit drift
        data.angle += data.speed * 0.2;
        sphere.position.x = Math.cos(data.angle) * data.radius;
        sphere.position.z = Math.sin(data.angle) * data.radius;
        
        // Bobbing vertical height
        sphere.position.y += Math.sin(Date.now() * 0.001 + data.offset) * 0.0015;
      });

      // Slowly spin particles
      particles.rotation.y += 0.0006;
      particles.rotation.x += 0.0003;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      if (frontTexture) frontTexture.dispose();
      if (backTexture) backTexture.dispose();
      
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      cardGeometry.dispose();
      edgeMaterial.dispose();
      frontMaterial.dispose();
      backMaterial.dispose();
      
      particleGeometry.dispose();
      particleMaterial.dispose();
      
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full min-h-[400px] lg:min-h-full bg-transparent" style={{ display: "block" }} />;
}

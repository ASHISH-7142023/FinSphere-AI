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
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00c896, 2, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Emerald Data Spheres (Bubbles)
    const sphereGroup = new THREE.Group();
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x00c896,
      transparent: true,
      opacity: 0.3,
      shininess: 100,
    });

    for (let i = 0; i < 8; i++) {
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2
      );
      sphere.scale.setScalar(Math.random() * 0.5 + 0.2);
      sphere.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ),
      };
      sphereGroup.add(sphere);
    }
    scene.add(sphereGroup);

    // Futuristic 3D Credit Card
    const cardGeometry = new THREE.BoxGeometry(3.5, 2.2, 0.05);
    const cardMaterial = new THREE.MeshStandardMaterial({
      color: 0x161d1a,
      metalness: 0.8,
      roughness: 0.2,
      emissive: new THREE.Color(0x00c896),
      emissiveIntensity: 0.1,
    });
    const card = new THREE.Mesh(cardGeometry, cardMaterial);
    scene.add(card);

    camera.position.z = 5;

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

      // Animate Spheres
      sphereGroup.children.forEach((obj) => {
        const sphere = obj as THREE.Mesh;
        const velocity = sphere.userData.velocity as THREE.Vector3;
        sphere.position.add(velocity);

        if (Math.abs(sphere.position.x) > 4) velocity.x *= -1;
        if (Math.abs(sphere.position.y) > 3) velocity.y *= -1;
        sphere.rotation.x += 0.01;
      });

      // Animate Card with Mouse lerping
      card.rotation.y = THREE.MathUtils.lerp(card.rotation.y, mouse.x * 0.5, 0.1);
      card.rotation.x = THREE.MathUtils.lerp(card.rotation.x, -mouse.y * 0.4, 0.1);
      card.position.y = Math.sin(Date.now() * 0.001) * 0.1;

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
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      cardGeometry.dispose();
      cardMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full min-h-[300px] lg:min-h-full bg-transparent" style={{ display: "block" }} />;
}

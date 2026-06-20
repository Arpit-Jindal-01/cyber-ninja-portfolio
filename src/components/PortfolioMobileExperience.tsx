import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, MotionValue, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import Tilt from 'react-parallax-tilt';

// Types representing the overhauled portfolio project mapping
interface Project {
  brand: string;
  niche: string;
  beforeImage: string;
  afterImage: string;
  calendarImage: string;
  glowColor: string; // RGB values for pulsing neon drop shadows
}

// 5 Projects data containing the strategy calendar images and glow properties
// Alternating between Blood Moon Red and Katana Silver glows
const projects: Project[] = [
  {
    brand: 'NutLux',
    niche: 'Premium Festive Gifting',
    beforeImage: '/nutlux-before.png',
    afterImage: '/nutlux-after.jpeg',
    calendarImage: '/Nutlux-calender.jpeg',
    glowColor: '0, 229, 255', // Electric Blue
  },
  {
    brand: 'Forge-X',
    niche: 'Performance Hardware',
    beforeImage: '/Forge-X-before.jpeg',
    afterImage: '/Forge-X-after.jpeg',
    calendarImage: '/Forge-X-calender.jpeg',
    glowColor: '229, 231, 235', // Katana Silver
  },
  {
    brand: 'Lumina Botanicals',
    niche: 'Luxury Skincare',
    beforeImage: '/Lumina Botanicals-before.jpeg',
    afterImage: '/Lumina Botanicals-after.jpeg',
    calendarImage: '/Lumina Botanicals-calender.jpeg',
    glowColor: '0, 229, 255', // Electric Blue
  },
  {
    brand: 'Flow A.I.',
    niche: 'Tech & SaaS',
    beforeImage: '/flow-ai-before.jpeg',
    afterImage: '/flow-ai-after.jpeg',
    calendarImage: '/flow-ai-calender.jpeg', // Explicitly hard-fixed path
    glowColor: '229, 231, 235', // Katana Silver
  },
  {
    brand: 'Lumina Estates',
    niche: 'Luxury Real Estate',
    beforeImage: '/Lumina Estates-before.jpeg',
    afterImage: '/Lumina Estates-after.jpeg',
    calendarImage: '/Lumina Estates-calender.jpeg',
    glowColor: '0, 229, 255', // Electric Blue
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

// 3D Ninja Robot Avatar Component in Vanilla Three.js
interface RobotAvatar3DProps {
  isScanning: boolean;
}

export function RobotAvatar3D({ isScanning }: RobotAvatar3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Grouping
    const robotGroup = new THREE.Group();
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.2, 0);
    robotGroup.add(headGroup);
    scene.add(robotGroup);

    // Stealth Carbon Droid Materials
    const stealthMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0x09090b, // deep charcoal carbon
      metalness: 0.95,
      roughness: 0.22,
    });

    const steelJointMaterial = new THREE.MeshStandardMaterial({
      color: 0x3f3f46, // steel joints
      metalness: 0.8,
      roughness: 0.3,
    });

    const visorRedMaterial = new THREE.MeshBasicMaterial({
      color: 0x00e5ff, // glowing visor electric blue
    });

    const scanLineMaterial = new THREE.MeshBasicMaterial({
      color: 0x00e5ff, // Electric blue scanner
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });

    // 1. Sleek Ninja Helmet shape
    const headGeo = new THREE.SphereGeometry(0.85, 32, 32);
    headGeo.scale(1, 1.15, 0.9);
    const headMesh = new THREE.Mesh(headGeo, stealthMetalMaterial);
    headGroup.add(headMesh);

    // 2. Narrow glowing cyclops visor
    const visorGeo = new THREE.CylinderGeometry(0.87, 0.87, 0.16, 32, 1, true, -Math.PI / 3, (Math.PI * 2) / 3);
    const visorMesh = new THREE.Mesh(visorGeo, visorRedMaterial);
    visorMesh.position.set(0, 0.12, 0.1);
    headGroup.add(visorMesh);

    // 3. Mecha joint details
    const earGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.25, 16);
    earGeo.rotateZ(Math.PI / 2);
    const leftEar = new THREE.Mesh(earGeo, steelJointMaterial);
    leftEar.position.set(-0.9, 0.1, 0);
    const rightEar = leftEar.clone();
    rightEar.position.set(0.9, 0.1, 0);
    headGroup.add(leftEar);
    headGroup.add(rightEar);

    // 4. Cyber Droid Horns/Antennae
    const antGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.55, 8);
    antGeo.rotateZ(Math.PI / 5);
    const leftAnt = new THREE.Mesh(antGeo, stealthMetalMaterial);
    leftAnt.position.set(-0.95, 0.35, 0);
    const rightAnt = leftAnt.clone();
    rightAnt.rotation.z = -Math.PI / 5;
    rightAnt.position.set(0.95, 0.35, 0);
    headGroup.add(leftAnt);
    headGroup.add(rightAnt);

    // 5. Neck joints
    const neckGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.35, 16);
    const neckMesh = new THREE.Mesh(neckGeo, steelJointMaterial);
    neckMesh.position.set(0, -0.65, 0);
    robotGroup.add(neckMesh);

    const collarGeo = new THREE.TorusGeometry(0.42, 0.07, 12, 24);
    collarGeo.rotateX(Math.PI / 2);
    const collarMesh = new THREE.Mesh(collarGeo, stealthMetalMaterial);
    collarMesh.position.set(0, -0.55, 0);
    robotGroup.add(collarMesh);

    // 6. Tactical Chest Armor
    const chestGeo = new THREE.CylinderGeometry(0.5, 1.15, 0.75, 4, 1, false);
    chestGeo.rotateY(Math.PI / 4);
    const chestMesh = new THREE.Mesh(chestGeo, stealthMetalMaterial);
    chestMesh.position.set(0, -1.15, 0);
    robotGroup.add(chestMesh);

    // Red cyber glow chest nodes
    const dotGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const leftDot = new THREE.Mesh(dotGeo, visorRedMaterial);
    leftDot.position.set(-0.35, -0.9, 0.52);
    const rightDot = leftDot.clone();
    rightDot.position.set(0.35, -0.9, 0.52);
    robotGroup.add(leftDot);
    robotGroup.add(rightDot);

    // 7. Scanning Laser ring
    const scanRingGeo = new THREE.RingGeometry(0.65, 1.4, 32);
    scanRingGeo.rotateX(Math.PI / 2);
    const scanRingMesh = new THREE.Mesh(scanRingGeo, scanLineMaterial);
    scanRingMesh.position.set(0, 0, 0);
    scene.add(scanRingMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.12);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight.position.set(2, 4, 5);
    scene.add(dirLight);

    const redPointLight = new THREE.PointLight(0x00e5ff, 2.5, 8);
    redPointLight.position.set(-2, 1, 2);
    scene.add(redPointLight);

    const silverPointLight = new THREE.PointLight(0xe5e7eb, 1.8, 6);
    silverPointLight.position.set(2, -1, 1);
    scene.add(silverPointLight);

    // Mouse tracking angle calculations
    const handleMouseMoveGlobal = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current = { x: clamp(x, -1, 1), y: clamp(y, -1, 1) };
    };

    window.addEventListener('mousemove', handleMouseMoveGlobal);

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    let animFrameId: number;
    let clock = new THREE.Clock();

    const draw = () => {
      const elapsed = clock.getElapsedTime();

      // Stealth floating drift
      robotGroup.position.y = Math.sin(elapsed * 1.5) * 0.08;

      // Mouse tracking head rotations (smooth interpolation)
      headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, mouseRef.current.x * 0.55, 0.08);
      headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, -mouseRef.current.y * 0.35, 0.08);

      // Minor body counter-rotation for organic feel
      robotGroup.rotation.y = THREE.MathUtils.lerp(robotGroup.rotation.y, mouseRef.current.x * 0.12, 0.05);

      // Scan animations
      if (isScanning) {
        visorRedMaterial.color.setHex(0xe5e7eb); // Visor flashes silver/white
        scanLineMaterial.opacity = (Math.sin(elapsed * 12) * 0.45) + 0.55;
        scanRingMesh.position.y = Math.sin(elapsed * 6) * 1.25;
        scanRingMesh.scale.setScalar(1.0 + Math.sin(elapsed * 6) * 0.12);
        redPointLight.intensity = 5.0 + Math.sin(elapsed * 25) * 2.0;
      } else {
        visorRedMaterial.color.setHex(0x00e5ff); // Electric blue
        scanLineMaterial.opacity = 0;
        redPointLight.intensity = 2.5;
      }

      renderer.render(scene, camera);
      animFrameId = requestAnimationFrame(draw);
    };

    draw();

    // Clean up Three.js context
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', handleMouseMoveGlobal);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      headGeo.dispose();
      visorGeo.dispose();
      earGeo.dispose();
      antGeo.dispose();
      neckGeo.dispose();
      collarGeo.dispose();
      chestGeo.dispose();
      dotGeo.dispose();
      scanRingGeo.dispose();
      stealthMetalMaterial.dispose();
      steelJointMaterial.dispose();
      visorRedMaterial.dispose();
      scanLineMaterial.dispose();
      renderer.dispose();
    };
  }, [isScanning]);

  return (
    <div
      ref={mountRef}
      className="w-[18rem] h-[18rem] md:w-[22rem] md:h-[22rem] relative z-20 cursor-pointer select-none mx-auto"
    />
  );
}

// Shuriken targeting custom cursor
function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const [hovered, setHovered] = useState(false);

  const springX = useSpring(mouseX, { stiffness: 450, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 450, damping: 28 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.cursor-pointer') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.classList.contains('cursor-pointer');

      setHovered(!!isClickable);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    document.documentElement.classList.add('custom-cursor-active');

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center mix-blend-screen"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        rotate: hovered ? 180 : 0,
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
    >
      {/* SVG Shuriken Targeting Reticle */}
      <svg
        width={hovered ? 52 : 36}
        height={hovered ? 52 : 36}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transition: 'width 0.22s ease-out, height 0.22s ease-out' }}
      >
        {/* Outer Reticle Crosshairs */}
        <path d="M 12 50 L 26 50" stroke="#00e5ff" strokeWidth="3" strokeLinecap="round" />
        <path d="M 88 50 L 74 50" stroke="#00e5ff" strokeWidth="3" strokeLinecap="round" />
        <path d="M 50 12 L 50 26" stroke="#00e5ff" strokeWidth="3" strokeLinecap="round" />
        <path d="M 50 88 L 50 74" stroke="#00e5ff" strokeWidth="3" strokeLinecap="round" />

        {/* Shuriken Blades (glowing blue) */}
        <path
          d="M 50 24 L 56 44 L 76 50 L 56 56 L 50 76 L 44 56 L 24 50 L 44 44 Z"
          fill="rgba(0, 229, 255, 0.22)"
          stroke="#00e5ff"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Katana Silver Target Point */}
        <circle cx="50" cy="50" r="4.5" fill="#e5e7eb" />
      </svg>
    </motion.div>
  );
}

// Rising Embers Particles & Radial Blood Moon Glow Background
function ReactiveAuroraBackground() {
  const bgX = useMotionValue(0.5);
  const bgY = useMotionValue(0.5);

  const springBgX = useSpring(bgX, { stiffness: 35, damping: 18 });
  const springBgY = useSpring(bgY, { stiffness: 35, damping: 18 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      bgX.set(e.clientX / window.innerWidth);
      bgY.set(e.clientY / window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [bgX, bgY]);

  // Ambient shifting gradients (Electric Blue & Katana Silver glow)
  const radialGradient = useTransform(
    [springBgX, springBgY],
    ([x, y]: any) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(0, 229, 255, 0.12) 0%, rgba(229, 231, 235, 0.06) 45%, transparent 85%)`
  );

  // Generate stable coordinates for 50 dojo rising ash embers
  const sparks = useRef(
    Array.from({ length: 50 }).map((_, i) => {
      const size = Math.random() * 3.5 + 1.5; // 1.5px to 5px
      const isRed = Math.random() > 0.4;
      const glowRGB = isRed ? '0, 229, 255' : '156, 163, 175'; // Electric Blue or Ash Silver
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size,
        color: `rgba(${glowRGB}, ${isRed ? 0.85 : 0.5})`,
        shadow: `0 0 10px rgba(${glowRGB}, 0.7)`,
        duration: Math.random() * 6 + 6, // 6s to 12s
        delay: Math.random() * -12,
        xOffset: Math.random() * 60 - 30,
        startRotate: Math.random() * 360,
      };
    })
  );

  return (
    <motion.div
      style={{ backgroundImage: radialGradient }}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full bg-black"
    >
      <div className="absolute inset-0 bg-hero-radial opacity-60" />
      {/* Dojo embers particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {sparks.current.map((spark) => (
          <motion.div
            key={spark.id}
            className="absolute rounded-full"
            style={{
              left: spark.left,
              top: spark.top,
              width: spark.size,
              height: spark.size,
              backgroundColor: spark.color,
              boxShadow: spark.shadow,
            }}
            animate={{
              y: [0, -window.innerHeight - 50],
              x: [0, spark.xOffset, 0],
              rotate: [spark.startRotate, spark.startRotate + 360],
              opacity: [0, 0.9, 0.9, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: spark.duration,
              delay: spark.delay,
              ease: 'linear',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// Reusable ScrollReveal container
function ScrollReveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] as const }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

// Snappy Tactical Command Button
export function MagneticButton({ children, onClick }: { children: string; onClick?: () => void }) {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 20, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 220, damping: 20, mass: 0.1 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    x.set(offsetX * 0.45);
    y.set(offsetY * 0.45);
  };

  const resetPosition = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetPosition}
      style={{ x: springX, y: springY }}
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="relative flex min-h-[4.25rem] w-full max-w-[20rem] mx-auto items-center justify-center rounded-xl bg-black text-white cursor-pointer overflow-hidden shadow-[0_0_20px_rgba(0,229,255,0.25)] hover:shadow-[0_0_55px_rgba(0,229,255,0.65)] transition-all duration-200 border border-cyan-950 hover:border-cyan-400 clip-tactical"
    >
      {/* Liquid Blood-Moon spinning border */}
      <div className="absolute -inset-[2px] bg-[linear-gradient(90deg,#00e5ff,#e5e7eb,#00e5ff)]" />

      {/* Inner Button Solid Backdrop */}
      <div className="absolute inset-[2px] bg-zinc-950 flex items-center justify-center hover:bg-black transition-colors duration-200 clip-tactical">
        {/* Snappy diagonal slicing glare */}
        <motion.div
          className="absolute inset-0 w-[200%] h-full bg-[linear-gradient(45deg,transparent_35%,rgba(255,255,255,0.7)_50%,transparent_65%)]"
          style={{ left: '-100%', skewX: -30, mixBlendMode: 'overlay', pointerEvents: 'none' }}
          variants={{
            hover: {
              x: ['-50%', '130%'],
            }
          }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        />
        <span className="relative z-10 font-display text-[0.72rem] font-bold uppercase tracking-[0.25em] text-white">
          {children}
        </span>
      </div>
    </motion.div>
  );
}

// Before/after image slider with scroll-linked parallax entry & snappy cursor hover glare
function VisualSlider({
  beforeImage,
  afterImage,
  imageScale,
  containerY,
}: {
  beforeImage: string;
  afterImage: string;
  imageScale: MotionValue<number>;
  containerY: MotionValue<number>;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100, 0, 100));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    updatePosition(event.clientX);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updatePosition(event.clientX);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    setDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <motion.div
      style={{ y: containerY }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-zinc-950 select-none cursor-crosshair border border-zinc-900"
    >
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute inset-0"
        style={{ touchAction: 'pan-y' }}
      >
        {/* Sweeping tactical drone scanline */}
        <div
          className={`absolute left-0 w-full h-[2px] bg-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.85),0_0_4px_rgba(0,229,255,0.5)] pointer-events-none z-30 transition-opacity duration-200 ${
            isHovered ? 'opacity-100 animate-scanline' : 'opacity-0'
          }`}
        />

        {/* Slicing diagonal glare */}
        <motion.div
          className="absolute inset-0 w-[200%] h-full bg-[linear-gradient(45deg,transparent_35%,rgba(255,255,255,0.7)_50%,transparent_65%)] z-20 pointer-events-none"
          style={{ left: '-100%', skewX: -30, mixBlendMode: 'overlay' }}
          animate={isHovered ? { x: ['0%', '150%'] } : { x: '-100%' }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        />

        {/* After image zoom-parallax entry */}
        <motion.img
          src={afterImage}
          alt="AIMM Campaign Output"
          style={{ scale: imageScale }}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          draggable={false}
        />

        {/* Before image zoom-parallax entry & clipping */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <motion.img
            src={beforeImage}
            alt="Raw Input Asset"
            style={{ scale: imageScale }}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.55))]" />

        {/* Dynamic Clipped RAW ASSET Badge */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-[0.6rem] font-black uppercase tracking-[0.25em] text-white backdrop-blur-md border border-white/10">
            RAW ASSET
          </span>
        </div>

        {/* Dynamic Clipped AIMM CAMPAIGN Badge */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
        >
          <span className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-[0.6rem] font-black uppercase tracking-[0.25em] text-white backdrop-blur-md border border-white/10">
            AIMM CAMPAIGN
          </span>
        </div>

        {/* Slider Center Line Divider handle */}
        <div
          className="absolute inset-y-0 z-20 pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div className="absolute -translate-x-1/2 h-full w-[2px] bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-black/90 shadow-[0_0_20px_rgba(0,0,0,0.6)]">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 9l-4 4 4 4m8 0l4-4-4-4" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// 3D Tilt Card component with reflective Glare & Neon drop shadow pops on hover
function TiltCalendarCard({
  image,
  glowColor,
  imageScale,
  containerY,
}: {
  image: string;
  glowColor: string;
  imageScale: MotionValue<number>;
  containerY: MotionValue<number>;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      style={{ y: containerY }}
      className="relative w-full overflow-visible py-4 flex justify-center"
    >
      <div className="w-full">
        <Tilt
          tiltMaxAngleX={10}
          tiltMaxAngleY={10}
          perspective={1200}
          scale={1.03}
          transitionSpeed={250} // Snappy lethal speed
          glareEnable={true}
          glareMaxOpacity={0.3}
          glarePosition="all"
          className="rounded-[1.5rem]"
          onEnter={() => setIsHovered(true)}
          onLeave={() => setIsHovered(false)}
        >
          <div
            style={{
              boxShadow: isHovered
                ? `0 0 55px rgba(${glowColor}, 0.65), 0 12px 36px rgba(0, 0, 0, 0.75)`
                : `0 0 15px rgba(${glowColor}, 0.15), 0 12px 30px rgba(0, 0, 0, 0.7)`,
              transition: 'box-shadow 0.25s ease, transform 0.25s ease',
            }}
            className="relative w-full overflow-hidden rounded-[1.5rem] border border-zinc-900/60 bg-zinc-950 select-none cursor-pointer"
          >
            {/* Sweeping tactical drone scanline */}
            <div
              className={`absolute left-0 w-full h-[2px] bg-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.85),0_0_4px_rgba(0,229,255,0.5)] pointer-events-none z-30 transition-opacity duration-200 ${
                isHovered ? 'opacity-100 animate-scanline' : 'opacity-0'
              }`}
            />

            {/* Snappy diagonal slicing glare */}
            <motion.div
              className="absolute inset-0 w-[200%] h-full bg-[linear-gradient(45deg,transparent_35%,rgba(255,255,255,0.75)_50%,transparent_65%)] z-20 pointer-events-none"
              style={{ left: '-100%', skewX: -30, mixBlendMode: 'overlay' }}
              animate={isHovered ? { x: ['0%', '150%'] } : { x: '-100%' }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            />

            {/* Strategy calendar image with zoom entry */}
            <motion.img
              src={image}
              alt="10-Day Strategy Calendar"
              style={{
                scale: imageScale,
              }}
              draggable={false}
              className="w-full h-auto block pointer-events-none relative z-10"
            />
          </div>
        </Tilt>
      </div>
    </motion.div>
  );
}

// ProjectBlock details a single brand release container
function ProjectBlock({ project, index }: { project: Project; index: number }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Track scroll-linked parallax progression per project block section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Interpolate zoom out scale and container vertical drift
  const imageScale = useTransform(scrollYProgress, [0, 0.38], [1.2, 1]);
  const containerY = useTransform(scrollYProgress, [0, 0.38], [90, 0]);

  return (
    <div
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center px-4 py-20 sm:px-8 relative z-10 bg-black"
    >
      <div className="mx-auto w-full max-w-md md:max-w-xl lg:max-w-3xl">
        {/* Brand Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-[0.6rem] font-black uppercase tracking-[0.32em] text-zinc-600">
            <span>PROJECT {index + 1}</span>
            <span>—</span>
            <span>AIMM CAMPAIGN RELEASE</span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-2 font-display text-4xl font-extrabold uppercase tracking-[0.12em] text-white sm:text-5xl"
          >
            {project.brand}
          </motion.h2>

          <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-zinc-400">
            {project.niche}
          </p>
        </div>

        {/* Visual Before/After Engine with Parallax */}
        <VisualSlider
          beforeImage={project.beforeImage}
          afterImage={project.afterImage}
          imageScale={imageScale}
          containerY={containerY}
        />

        {/* 10-Day Growth Section Image tilt & Glare */}
        <div className="mt-14">
          <h3 className="font-display italic text-sm font-bold tracking-[0.16em] text-zinc-300">
            The 10-Day Growth & Marketing Strategy
          </h3>
          <TiltCalendarCard
            image={project.calendarImage}
            glowColor={project.glowColor}
            imageScale={imageScale}
            containerY={containerY}
          />
        </div>
      </div>
      {/* Glitching Section Divider */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#00e5ff]/45 shadow-[0_0_8px_rgba(0,229,255,0.3),0_0_2px_rgba(0,229,255,0.15)] animate-flicker-line pointer-events-none" />
    </div>
  );
}

// Value Matrix Card Component
interface ValueCardProps {
  title: string;
  body: string;
}

function ValueCard({ title, body }: ValueCardProps) {
  return (
    <div className="bg-zinc-950 border border-zinc-900 hover:border-[#00e5ff] hover:shadow-[0_0_25px_rgba(0,229,255,0.2)] p-8 relative overflow-hidden group transition-all duration-300 rounded-2xl">
      {/* Faint blue radial gradient on hover */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.06),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Title */}
      <h3 className="font-bold text-white text-xl mb-4 tracking-wide group-hover:text-[#00e5ff] transition-colors duration-300">
        {title}
      </h3>

      {/* Body */}
      <p className="text-zinc-400 text-sm leading-relaxed relative z-10 select-text">
        {body}
      </p>
    </div>
  );
}

// Main page container component
export function PortfolioMobileExperience() {
  const contactSectionRef = useRef<HTMLDivElement>(null);

  // States for 3D Droid Scan + Typewriter Bubble trigger
  const [isScanning, setIsScanning] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);

  const welcomeMessage = "Stealth Scanner: Engaged. Welcome to Arpit's cyber studio. I am his mecha-assassin agent. Explore our silent marketing operations below.";

  const handleTriggerScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setChatVisible(true);
    setTypedText('');

    // Character ticking interval loop
    let charIndex = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + welcomeMessage.charAt(charIndex));
      charIndex++;
      if (charIndex >= welcomeMessage.length) {
        clearInterval(interval);
      }
    }, 28);

    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  // Track scroll position of contact section to trigger Dim / Black Hole Spotlight Overlay
  const { scrollYProgress: contactScrollProgress } = useScroll({
    target: contactSectionRef,
    offset: ['start end', 'end end'],
  });

  // Calculate black hole shadow spotlight opacity as user scrolls near contact section
  const blackHoleIntensity = useTransform(contactScrollProgress, [0.1, 0.85], [0, 0.9]);

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white/20 select-text overflow-x-hidden">
      {/* Shuriken custom cursor */}
      <CustomCursor />

      {/* Cinematic noise overlay grain */}
      <div className="pointer-events-none fixed inset-[-200%] z-40 h-[400%] w-[400%] bg-noise opacity-[0.04] animate-noise" />

      {/* Reactive Aurora and drifting dojo ash sparks field */}
      <ReactiveAuroraBackground />

      {/* Hero Header Hook Container */}
      <section className="relative z-10 flex h-[100dvh] flex-col justify-between px-6 py-12 sm:px-8">
        <div />

        <div className="mx-auto w-full max-w-4xl text-center space-y-6 px-4 flex flex-col items-center">

          {/* Centered 3D Ninja Droid + Click interaction trigger */}
          <div className="flex flex-col items-center justify-center relative w-full mb-2">
            {/* Subtle glowing blue aura behind 3D canvas */}
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[18rem] h-[18rem] md:w-[22rem] md:h-[22rem] z-10 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.18),transparent_65%)] pointer-events-none rounded-full blur-xl animate-pulse" />

            <RobotAvatar3D isScanning={isScanning} />

            {/* Avatar overlay action node */}
            <div
              onClick={handleTriggerScan}
              className="absolute z-30 cursor-pointer rounded-full w-[16rem] h-[16rem] md:w-[20rem] md:h-[20rem] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            />

            {/* Glassmorphic Cyber-Ninja Welcome Bubble */}
            <AnimatePresence>
              {chatVisible && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 15 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="absolute bottom-[-1.5rem] z-30 bg-zinc-950/90 border border-cyan-950/60 backdrop-blur-md px-5 py-3.5 rounded-2xl w-full max-w-[20rem] text-center shadow-[0_0_35px_rgba(0,229,255,0.22)] flex flex-col items-center gap-1 select-text pointer-events-auto"
                >
                  <p className="font-mono text-[0.66rem] uppercase tracking-widest text-[#00e5ff] font-bold mb-1">
                    [SHADOW_AGENT_REPLY]
                  </p>
                  <p className="font-mono text-xs leading-relaxed text-zinc-200">
                    {typedText}
                    <span className="inline-block w-1.5 h-3 bg-[#00e5ff] ml-0.5 animate-pulse" />
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setChatVisible(false);
                    }}
                    className="mt-2 text-[0.55rem] font-bold uppercase tracking-wider text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  >
                    Dismiss Agent
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tactical Tagline */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-mono text-[#00e5ff] text-xs md:text-sm tracking-[0.5em] uppercase mb-6 opacity-80 flex items-center justify-center w-full"
          >
            <span className="mr-[-0.5em]">// ENGINEERING YOUR UNFAIR ADVANTAGE<span className="animate-cursor-blink">_</span></span>
          </motion.div>

          {/* Typography Overhaul - Reverted to Syncopate Wide font with centering tweaks */}
          <motion.h1
            initial={{ opacity: 0, filter: 'blur(10px)', y: 25 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] as const }}
            className="group flex flex-col items-center justify-center font-display font-black text-white text-5xl md:text-7xl tracking-[0.22em] hover:tracking-[0.3em] hover:text-white scale-100 hover:scale-105 hover:drop-shadow-[3px_0px_0px_rgba(0,229,255,0.7),_-3px_0px_0px_rgba(176,38,255,0.7),_0_0_30px_rgba(0,229,255,0.8)] transition-all duration-75 ease-in cursor-crosshair leading-[0.95] text-center overflow-visible select-text"
          >
            <span className="mr-[-0.22em] group-hover:mr-[-0.3em] transition-all duration-75 ease-in">ARPIT</span>
            <span className="mr-[-0.22em] group-hover:mr-[-0.3em] transition-all duration-75 ease-in">JINDAL</span>
          </motion.h1>

          <motion.p
            className="text-sm leading-relaxed tracking-wide text-zinc-300 md:text-base font-normal max-w-2xl mx-auto text-center px-4 select-text"
            initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
          >
            I am a solo founder combining an eye for high-end graphic design with AI to build full-stack marketing engines. I don't just generate images—I engineer hyper-realistic, campaign-ready product visuals and completely manage your entire month’s social media strategy. I handle the end-to-end marketing so you can focus on scaling your business.
          </motion.p>
        </div>

        {/* Pulsing scroll swipe down indicator */}
        <div className="flex justify-center select-none">
          <motion.a
            href="#projects"
            className="flex flex-col items-center gap-2 cursor-pointer group"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <span className="text-[0.62rem] font-bold uppercase tracking-[0.25em] text-zinc-500 group-hover:text-white transition-colors duration-300">
              Swipe Down
            </span>
            <motion.div
              className="h-8 w-5 rounded-full border border-zinc-700 p-1 flex justify-center backdrop-blur-sm"
              animate={{
                boxShadow: [
                  '0 0 0px rgba(255,255,255,0)',
                  '0 0 10px rgba(0,229,255,0.25)',
                  '0 0 0px rgba(255,255,255,0)',
                ],
              }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            >
              <motion.div
                className="h-1.5 w-1.5 rounded-full bg-red-500"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              />
            </motion.div>
          </motion.a>
        </div>
      </section>

      {/* Value Matrix Section */}
      <section className="relative z-10 bg-black border-t border-zinc-955">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="font-mono text-[#00e5ff] text-sm tracking-[0.3em] uppercase mb-12 text-center">
            // CORE_PROTOCOLS: HOW I SCALE YOUR BRAND
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ValueCard
              title="[01] AI VISUAL ENGINEERING"
              body="Stop burning budget on slow, expensive photoshoots. I engineer hyper-realistic, studio-quality product and lifestyle imagery at massive scale, indistinguishable from reality."
            />
            <ValueCard
              title="[02] 30-DAY GROWTH ENGINES"
              body="Pretty pictures don't print money. I map every visual to a psychological, 30-day tactical content calendar designed to capture leads, build authority, and drive direct sales."
            />
            <ValueCard
              title="[03] AUTONOMOUS EXECUTION"
              body="You run the business; I run the engine. I handle the end-to-end management—from copywriting and hashtag strategy to posting and funnel automation. Zero bandwidth required from you."
            />
          </div>
        </div>
        {/* Glitching Section Divider */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#00e5ff]/45 shadow-[0_0_8px_rgba(0,229,255,0.3),0_0_2px_rgba(0,229,255,0.15)] animate-flicker-line pointer-events-none" />
      </section>

      {/* Projects listing layout */}
      <div id="projects" className="relative z-10 bg-black">
        {projects.map((project, idx) => (
          <ProjectBlock key={project.brand} project={project} index={idx} />
        ))}
      </div>

      {/* Stark Overhauled Terminal Contact Section */}
      <section
        ref={contactSectionRef}
        className="relative z-10 flex h-[100dvh] flex-col justify-between px-6 py-12 sm:px-12 bg-black border-t border-zinc-950 overflow-hidden"
      >
        {/* Contact Black Hole Spotlight Overlay */}
        <motion.div
          style={{ opacity: blackHoleIntensity }}
          className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_20%,rgba(0,0,0,0.92)_75%)]"
        />

        <div />

        <ScrollReveal>
          <div className="relative z-20 mx-auto w-full max-w-4xl text-center space-y-8 px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="font-display text-3xl md:text-5xl leading-[1.2] tracking-[0.16em] text-white max-w-4xl mx-auto uppercase font-bold text-center"
            >
              <span className="mr-[-0.16em]">Your brand deserves better than generic marketing. Let's build your engine.</span>
            </motion.h2>

            <AnimatePresence mode="wait">
              {!isRevealed ? (
                <motion.div
                  key="cta-button"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-50 pointer-events-auto w-full flex justify-center"
                >
                  <MagneticButton onClick={() => setIsRevealed(true)}>
                    PITCH ME YOUR BRAND
                  </MagneticButton>
                </motion.div>
              ) : (
                <motion.div
                  key="terminal-readout"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="relative z-50 pointer-events-auto mx-auto w-full max-w-lg p-6 bg-black border border-[#00e5ff] rounded-2xl shadow-[0_0_35px_rgba(0,229,255,0.25),inset_0_0_20px_rgba(0,229,255,0.1)] text-center font-mono select-text flex flex-col items-center gap-4"
                >
                  <h3 className="text-[#00e5ff] font-bold tracking-widest text-sm sm:text-base">
                    SECURE TRANSMISSION INITIATED.
                  </h3>
                  <p className="text-[0.72rem] sm:text-[0.8rem] text-zinc-300 leading-relaxed text-left">
                    If you are ready to scale, send your pitch to the address below. You must include your brand name, current monthly revenue, your biggest visual/marketing bottleneck, and a link to your current website/socials. Incomplete pitches will be ignored.
                  </p>
                  <div className="w-full overflow-hidden">
                    <a
                      href="mailto:jindalarpit0228@gmail.com"
                      className="block w-full break-all font-mono text-lg sm:text-xl md:text-3xl lg:text-4xl text-white hover:text-[#00e5ff] transition-colors duration-300 mt-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] cursor-crosshair select-all"
                    >
                      jindalarpit0228@gmail.com
                    </a>
                  </div>
                  <button
                    onClick={() => setIsRevealed(false)}
                    className="text-zinc-500 hover:text-white text-sm mt-4 cursor-crosshair font-bold transition-colors uppercase tracking-widest"
                  >
                    CLOSE
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>

        {/* Footer info branding block */}
        <div className="relative z-20 mx-auto w-full max-w-md md:max-w-xl lg:max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-900/60 pt-8 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-zinc-500">
          <span>Arpit Jindal | AIMM Specialist</span>
          <span>jindalarpit0228@gmail.com</span>
          <span>© 2026. Stealth Operations.</span>
        </div>
      </section>
    </div>
  );
}
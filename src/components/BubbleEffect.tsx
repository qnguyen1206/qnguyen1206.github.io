import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';

interface Bubble {
  x: number;
  y: number;
  size: number;
  speedY: number;
  opacity: number;
}

interface InkDrop {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  opacity: number;
}

export function BubbleEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const inkDropsRef = useRef<InkDrop[]>([]);
  const { addXP } = useGame();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const MAX_BUBBLES = 20;

    const createBubble = () => {
      if (bubblesRef.current.length >= MAX_BUBBLES) return;
      
      const size = Math.random() * 15 + 5;
      bubblesRef.current.push({
        x: Math.random() * canvas.width,
        y: canvas.height + size,
        size,
        speedY: Math.random() * 0.5 + 0.3,
        opacity: 0.1 + Math.random() * 0.2
      });
    };

    const createInkBurst = (x: number, y: number) => {
      const numDrops = 8;
      for (let i = 0; i < numDrops; i++) {
        inkDropsRef.current.push({
          x,
          y,
          radius: 5,
          maxRadius: Math.random() * 50 + 25,
          speed: Math.random() * 0.1 + 1,
          opacity: 0.3
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (Math.random() > 0.98) {
        createBubble();
      }

      // Animate bubbles
      bubblesRef.current.forEach((bubble, index) => {
        if (bubble.y < -bubble.size) {
          bubblesRef.current.splice(index, 1);
          return;
        }

        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(59, 130, 246, ${bubble.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        bubble.y -= bubble.speedY;
        bubble.x += Math.sin(bubble.y * 0.02) * 0.5;
      });

      // Animate ink drops
      inkDropsRef.current.forEach((drop, index) => {
        if (drop.radius >= drop.maxRadius || drop.opacity <= 0) {
          inkDropsRef.current.splice(index, 1);
          return;
        }

        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${drop.opacity})`;
        ctx.fill();

        drop.radius += drop.speed;
        drop.opacity -= 0.01;
      });

      requestAnimationFrame(animate);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const bubbleIndex = bubblesRef.current.findIndex(bubble => {
        const dx = bubble.x - x;
        const dy = bubble.y - y;
        return Math.sqrt(dx * dx + dy * dy) < bubble.size + 20;
      });

      if (bubbleIndex !== -1) {
        const bubble = bubblesRef.current[bubbleIndex];
        createInkBurst(bubble.x, bubble.y);
        bubblesRef.current.splice(bubbleIndex, 1);
        const xpGain = Math.floor(Math.random() * 5) + 1;
        addXP(xpGain);
      }
    };

    let animationFrameId: number;
    animationFrameId = requestAnimationFrame(animate);
    canvas.addEventListener('click', handleClick);
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0"
      style={{ 
        zIndex: 0,
        background: 'transparent',
        mixBlendMode: 'lighten',
        pointerEvents: 'all'
      }}
    />
  );
} 
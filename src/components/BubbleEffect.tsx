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
  const { addXP } = useGame();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const bubbles: Bubble[] = [];
    const inkDrops: InkDrop[] = [];

    const MAX_BUBBLES = 20;

    const createBubble = () => {
      if (bubbles.length >= MAX_BUBBLES) return;
      
      const size = Math.random() * 15 + 5;
      bubbles.push({
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
        inkDrops.push({
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
      
      if (Math.random() > 0.95) {
        createBubble();
      }

      // Animate bubbles
      bubbles.forEach((bubble, index) => {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(59, 130, 246, ${bubble.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        bubble.y -= bubble.speedY;
        bubble.x += Math.sin(bubble.y * 0.02) * 0.5;

        if (bubble.y < -bubble.size) {
          bubbles.splice(index, 1);
        }
      });

      // Animate ink drops
      inkDrops.forEach((drop, index) => {
        if (drop.radius >= drop.maxRadius || drop.opacity <= 0) {
          inkDrops.splice(index, 1);
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
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;
      
      const x = e.clientX + scrollX - rect.left;
      const y = e.clientY + scrollY - rect.top;

      for (let i = bubbles.length - 1; i >= 0; i--) {
        const bubble = bubbles[i];
        const dx = bubble.x - x;
        const dy = bubble.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < bubble.size + 10) {
          createInkBurst(bubble.x, bubble.y);
          bubbles.splice(i, 1);
          const xpGain = Math.floor(Math.random() * 5) + 1;
          addXP(xpGain);
          break;
        }
      }
    };

    animate();
    canvas.addEventListener('click', handleClick);
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    return () => {
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('resize', () => {});
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
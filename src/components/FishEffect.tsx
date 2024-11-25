import { useRef, useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';

interface Fish {
  x: number;
  y: number;
  speed: number;
  direction: number;
  size: number;
  color: string;
  targetX?: number;
  targetY?: number;
}

export function FishEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fishesRef = useRef<Fish[]>([]);
  const { addXP } = useGame();
  const [clickedOnFish, setClickedOnFish] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const experienceSection = document.getElementById('experience');
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (experienceSection) {
      observer.observe(experienceSection);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const inkDrops: Array<{
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      speed: number;
      opacity: number;
    }> = [];

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

    const drawFish = (fish: Fish) => {
      ctx.save();
      ctx.translate(fish.x, fish.y);
      ctx.scale(fish.direction, 1);
      
      ctx.fillStyle = fish.color;
      
      // Fish body
      ctx.beginPath();
      ctx.ellipse(0, 0, fish.size, fish.size/2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Tail
      ctx.beginPath();
      ctx.moveTo(-fish.size/2, 0);
      ctx.lineTo(-fish.size * 1.2, -fish.size/3);
      ctx.lineTo(-fish.size * 1.2, fish.size/3);
      ctx.closePath();
      ctx.fill();
      
      // Eye
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(fish.size/3, -fish.size/6, fish.size/6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(fish.size/3, -fish.size/6, fish.size/12, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    fishesRef.current = Array.from({ length: 5 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 0.5 + Math.random() * 1,
      direction: Math.random() < 0.5 ? -1 : 1,
      size: 15 + Math.random() * 20,
      color: `hsl(${Math.random() * 60 + 180}, 70%, 50%)`,
      targetX: undefined,
      targetY: undefined
    }));

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;
      
      const x = e.clientX + scrollX - rect.left;
      const y = e.clientY + scrollY - rect.top;

      let hitFish = false;
      fishesRef.current.forEach(fish => {
        const dx = fish.x - x;
        const dy = fish.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < fish.size) {
          hitFish = true;
          fish.targetX = x;
          fish.targetY = y;
          fish.direction = fish.x > x ? -1 : 1;
          addXP(1);
        }
      });

      setClickedOnFish(hitFish);
      if (!hitFish) {
        e.stopPropagation();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

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

      // Animate fish
      fishesRef.current.forEach(fish => {
        if (!isVisible) {
          // Swim away when not visible
          const centerX = canvas.width / 2;
          const dx = fish.x - centerX;
          const direction = dx > 0 ? 1 : -1;
          fish.x += fish.speed * 2 * direction;
          fish.direction = direction;
        } else {
          if (fish.targetX !== undefined && fish.targetY !== undefined) {
            const dx = fish.targetX - fish.x;
            const dy = fish.targetY - fish.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 5) {
              fish.x += (dx / distance) * fish.speed;
              fish.y += (dy / distance) * fish.speed;
              fish.direction = dx > 0 ? 1 : -1;
            } else {
              fish.targetX = undefined;
              fish.targetY = undefined;
            }
          } else {
            fish.x += fish.speed * fish.direction;
            fish.y += Math.sin(Date.now() * 0.002) * 0.5;

            if (fish.x > canvas.width + fish.size * 2) {
              fish.x = -fish.size * 2;
            } else if (fish.x < -fish.size * 2) {
              fish.x = canvas.width + fish.size * 2;
            }

            if (fish.y > canvas.height + fish.size) {
              fish.y = -fish.size;
            } else if (fish.y < -fish.size) {
              fish.y = canvas.height + fish.size;
            }
          }
        }

        drawFish(fish);
      });

      requestAnimationFrame(animate);
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

  useEffect(() => {
    if (isVisible) {
      // Reset fish positions when becoming visible
      fishesRef.current = Array.from({ length: 5 }, () => ({
        x: Math.random() < 0.5 ? -20 : window.innerWidth + 20,
        y: Math.random() * window.innerHeight,
        speed: 0.5 + Math.random() * 1,
        direction: Math.random() < 0.5 ? -1 : 1,
        size: 15 + Math.random() * 20,
        color: `hsl(${Math.random() * 60 + 180}, 70%, 50%)`,
        targetX: undefined,
        targetY: undefined
      }));
    }
  }, [isVisible]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0"
      style={{ 
        zIndex: 0,
        background: 'transparent',
        mixBlendMode: 'lighten',
        pointerEvents: clickedOnFish ? 'all' : 'none',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 1s ease-in-out',
        visibility: isVisible ? 'visible' : 'hidden'
      }}
    />
  );
}
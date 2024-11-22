import { useEffect, useRef } from 'react';

export function InkEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const createInkDrop = (x: number, y: number) => {
      inkDrops.push({
        x,
        y,
        radius: 2,
        maxRadius: Math.random() * 100 + 50,
        speed: Math.random() * 0.5 + 1,
        opacity: 0.3
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
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
        drop.opacity -= 0.005;
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.85) {
        createInkDrop(e.clientX, e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', () => {});
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
} 
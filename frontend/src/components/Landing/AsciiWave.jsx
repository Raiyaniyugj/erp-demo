import { useEffect, useRef } from 'react';

export default function AsciiWave() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const chars = '.,-~:;=!*#$@';
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const cols = Math.floor(canvas.width / 15);
      const rows = Math.floor(canvas.height / 15);
      
      ctx.fillStyle = '#262626'; // Muted text color
      ctx.font = '12px monospace';
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * 15;
          const y = j * 15;
          
          // Simple wave math
          const waveX = Math.sin(x * 0.01 + time) * 10;
          const waveY = Math.cos(y * 0.01 + time) * 10;
          const noise = Math.sin((x + waveX) * 0.01 + (y + waveY) * 0.01 + time);
          
          // Map noise (-1 to 1) to chars array index
          const charIndex = Math.floor(((noise + 1) / 2) * chars.length);
          const char = chars[Math.min(charIndex, chars.length - 1)];
          
          ctx.fillText(char, x, y);
        }
      }
      
      time += 0.02;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40 pointer-events-none" />;
}

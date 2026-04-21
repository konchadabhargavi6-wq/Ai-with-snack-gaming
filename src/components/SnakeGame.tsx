import React, { useEffect, useRef, useState, useCallback } from 'react';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

const GRID_SIZE = 25;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check collision with food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newS = s + 10;
          onScoreChange(newS);
          return newS;
        });
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, onScoreChange]);

  const generateFood = (currentSnake: { x: number; y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    setFood(newFood);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    onScoreChange(0);
    setIsGameOver(false);
    setIsPaused(false);
    generateFood(INITIAL_SNAKE);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 's':
        case 'arrowdown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'a':
        case 'arrowleft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'd':
        case 'arrowright':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (isGameOver) {
            resetGame();
          } else {
            setIsPaused((p) => !p);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 100);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid (Subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Food
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ffff';
    ctx.fillStyle = '#00ffff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.shadowBlur = isHead ? 20 : 10;
      ctx.shadowColor = '#ec4899';
      ctx.fillStyle = isHead ? '#f472b6' : '#ec4899';
      
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;
      
      if (isHead) {
        ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
      } else {
        ctx.fillRect(x + 4, y + 4, cellSize - 8, cellSize - 8);
      }
    });

    // Overlays
    if (isGameOver) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('CORE COLLAPSE', canvas.width / 2, canvas.height / 2 - 20);
      
      ctx.font = '14px monospace';
      ctx.fillStyle = '#ec4899';
      ctx.fillText('PRESS SPACE TO REBOOT', canvas.width / 2, canvas.height / 2 + 30);
    } else if (isPaused) {
       ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#666';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SYSTEM PAUSED', canvas.width / 2, canvas.height / 2);
      ctx.font = '12px monospace';
      ctx.fillText('TAP SPACE TO RESUME', canvas.width / 2, canvas.height / 2 + 30);
    }

  }, [snake, food, isGameOver, isPaused]);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="w-full h-auto aspect-square max-w-full rounded-xl bg-black shadow-[0_0_20px_rgba(236,72,153,0.1)]"
        onClick={() => !isGameOver && setIsPaused(p => !p)}
      />
    </div>
  );
}

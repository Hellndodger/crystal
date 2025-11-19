import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimerProps {
  onTimeUpdate: (seconds: number) => void;
}

export const Timer = ({ onTimeUpdate }: TimerProps) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const newValue = prev + 1;
          onTimeUpdate(newValue);
          return newValue;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, onTimeUpdate]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setSeconds(0);
    setIsRunning(false);
    onTimeUpdate(0);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8 border-2 border-primary/30 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl rounded-xl shadow-lg">
      <div className="text-6xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary tracking-wider animate-glow-pulse">
        {formatTime(seconds)}
      </div>
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsRunning(!isRunning)}
          className="h-14 w-14 hover:scale-110 transition-transform duration-300 border-2"
        >
          {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          className="h-14 w-14 hover:scale-110 transition-transform duration-300 border-2"
        >
          <RotateCcw className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

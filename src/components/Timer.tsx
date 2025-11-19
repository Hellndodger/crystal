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
    <div className="flex flex-col items-center gap-4 p-6 border border-border bg-card rounded">
      <div className="text-5xl font-mono font-bold text-primary tracking-wider">
        {formatTime(seconds)}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsRunning(!isRunning)}
          className="h-12 w-12"
        >
          {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          className="h-12 w-12"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

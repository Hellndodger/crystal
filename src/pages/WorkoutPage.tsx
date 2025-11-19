import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer } from '@/components/Timer';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Save, Trash2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface WorkoutSet {
  time: number;
  addedWeight: number;
}

interface ExerciseData {
  name: string;
  sets: WorkoutSet[];
}

export const WorkoutPage = () => {
  const { data, saveWorkout } = useData();
  const navigate = useNavigate();
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<ExerciseData[]>([]);
  const [currentExercise, setCurrentExercise] = useState<string>('');
  const [currentSet, setCurrentSet] = useState<WorkoutSet>({ time: 0, addedWeight: 0 });
  const [workoutStarted, setWorkoutStarted] = useState(false);

  const handleExerciseToggle = (exercise: string) => {
    setSelectedExercises((prev) =>
      prev.includes(exercise)
        ? prev.filter((e) => e !== exercise)
        : [...prev, exercise]
    );
  };

  const handleStartWorkout = () => {
    if (selectedExercises.length === 0) {
      toast.error('Please select at least one exercise');
      return;
    }
    setWorkoutStarted(true);
    setCurrentExercise(selectedExercises[0]);
    setActiveWorkout(
      selectedExercises.map((name) => ({ name, sets: [] }))
    );
  };

  const handleAddSet = () => {
    if (currentSet.time === 0) {
      toast.error('Time must be greater than 0');
      return;
    }

    setActiveWorkout((prev) =>
      prev.map((ex) =>
        ex.name === currentExercise
          ? { ...ex, sets: [...ex.sets, currentSet] }
          : ex
      )
    );
    setCurrentSet({ time: 0, addedWeight: 0 });
    toast.success('Set added!');
  };

  const handleRemoveSet = (exerciseName: string, setIndex: number) => {
    setActiveWorkout((prev) =>
      prev.map((ex) =>
        ex.name === exerciseName
          ? { ...ex, sets: ex.sets.filter((_, idx) => idx !== setIndex) }
          : ex
      )
    );
  };

  const handleFinishWorkout = () => {
    const hasAtLeastOneSet = activeWorkout.some((ex) => ex.sets.length > 0);
    if (!hasAtLeastOneSet) {
      toast.error('Add at least one set before finishing');
      return;
    }

    const workoutData = {
      date: new Date().toISOString(),
      exercises: activeWorkout.filter((ex) => ex.sets.length > 0),
    };

    saveWorkout(workoutData);
    
    // Celebration confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#a855f7', '#3b82f6'],
    });
    
    toast.success('🎉 Workout Complete! Amazing work!');
    navigate('/history');
  };

  if (!workoutStarted) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70 flex items-center gap-3">
          Select Exercises
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
        </h2>
        <Card className="border-border bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl">Choose your static holds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.availableExercises.map((exercise, index) => (
              <div
                key={exercise}
                className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary bg-gradient-to-r from-muted/30 to-transparent transition-all duration-300 hover:scale-[1.02] animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Checkbox
                  id={exercise}
                  checked={selectedExercises.includes(exercise)}
                  onCheckedChange={() => handleExerciseToggle(exercise)}
                />
                <label
                  htmlFor={exercise}
                  className="flex-1 cursor-pointer font-medium"
                >
                  {exercise}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
        <Button
          onClick={handleStartWorkout}
          size="lg"
          className="w-full mt-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300"
          disabled={selectedExercises.length === 0}
        >
          <Sparkles className="h-5 w-5 mr-2" />
          Start Workout
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70 flex items-center gap-3">
          Active Workout
          <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
        </h2>
        <Button
          onClick={handleFinishWorkout}
          size="lg"
          className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Save className="h-5 w-5" />
          Finish Workout
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Set Input */}
        <div className="space-y-4">
          <Card className="border-border bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Current Exercise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="exercise-select">Exercise</Label>
                <select
                  id="exercise-select"
                  value={currentExercise}
                  onChange={(e) => setCurrentExercise(e.target.value)}
                  className="w-full mt-2 px-3 py-2 bg-muted border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {selectedExercises.map((ex) => (
                    <option key={ex} value={ex}>
                      {ex}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="time">Time (seconds)</Label>
                <Input
                  id="time"
                  type="number"
                  min="0"
                  value={currentSet.time || ''}
                  onChange={(e) =>
                    setCurrentSet((prev) => ({
                      ...prev,
                      time: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="weight">Added Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  step="0.5"
                  value={currentSet.addedWeight || ''}
                  onChange={(e) =>
                    setCurrentSet((prev) => ({
                      ...prev,
                      addedWeight: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="mt-2"
                />
              </div>

              <Button
                onClick={handleAddSet}
                size="lg"
                className="w-full gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="h-5 w-5" />
                Add Set
              </Button>
            </CardContent>
          </Card>

          <Timer onTimeUpdate={(seconds) => setCurrentSet((prev) => ({ ...prev, time: seconds }))} />
        </div>

        {/* Workout Summary */}
        <div>
          <Card className="border-border bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Workout Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeWorkout.map((exercise) => (
                <div key={exercise.name}>
                  <h3 className="font-semibold mb-2 text-primary">
                    {exercise.name}
                  </h3>
                  {exercise.sets.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No sets yet</p>
                  ) : (
                    <div className="space-y-2">
                      {exercise.sets.map((set, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-muted/30 px-3 py-2 rounded text-sm"
                        >
                          <div>
                            <span className="font-medium">Set {idx + 1}:</span>{' '}
                            {set.time}s
                            {set.addedWeight > 0 && (
                              <span className="text-primary ml-2">
                                +{set.addedWeight}kg
                              </span>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSet(exercise.name, idx)}
                            className="h-6 w-6"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

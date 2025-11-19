import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

export const StatsPage = () => {
  const { data, updateUserStats } = useData();
  const { user, availableExercises, logs } = data;

  const handleExerciseToggle = (exercise: string) => {
    const current = user.selectedStatsExercises;
    let updated: string[];

    if (current.includes(exercise)) {
      updated = current.filter((e) => e !== exercise);
    } else {
      if (current.length >= 5) {
        toast.error('Maximum 5 exercises allowed for the pentagon chart');
        return;
      }
      updated = [...current, exercise];
    }

    updateUserStats('selectedStatsExercises', updated);
  };

  const calculateMaxVolume = (exerciseName: string): number => {
    let maxVolume = 0;

    logs.forEach((log) => {
      log.exercises.forEach((exercise) => {
        if (exercise.name === exerciseName) {
          exercise.sets.forEach((set) => {
            const volume = (user.bodyWeight + set.addedWeight) * set.time;
            if (volume > maxVolume) {
              maxVolume = volume;
            }
          });
        }
      });
    });

    return maxVolume;
  };

  const getChartData = () => {
    if (user.selectedStatsExercises.length !== 5) {
      return [];
    }

    return user.selectedStatsExercises.map((exercise) => ({
      exercise: exercise.length > 10 ? exercise.substring(0, 10) + '...' : exercise,
      fullName: exercise,
      volume: calculateMaxVolume(exercise),
    }));
  };

  const chartData = getChartData();
  const maxDomain = Math.max(...chartData.map((d) => d.volume), 1000);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Performance Statistics</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Exercise Selection */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>Select 5 Exercises for Pentagon Chart</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Choose exactly 5 exercises to visualize your progress
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableExercises.map((exercise) => {
              const isSelected = user.selectedStatsExercises.includes(exercise);
              const maxVolume = calculateMaxVolume(exercise);
              return (
                <div
                  key={exercise}
                  className={`flex items-center justify-between p-3 rounded border transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <Checkbox
                      id={exercise}
                      checked={isSelected}
                      onCheckedChange={() => handleExerciseToggle(exercise)}
                      disabled={
                        !isSelected && user.selectedStatsExercises.length >= 5
                      }
                    />
                    <label htmlFor={exercise} className="cursor-pointer font-medium">
                      {exercise}
                    </label>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Max: <span className="text-primary font-mono">{maxVolume}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Pentagon Chart */}
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>Performance Pentagon</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Volume = (Bodyweight + Added Weight) × Time
            </p>
          </CardHeader>
          <CardContent>
            {chartData.length === 5 ? (
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={chartData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis
                    dataKey="exercise"
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                  />
                  <Radar
                    name="Max Volume"
                    dataKey="volume"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-center">
                <div>
                  <div className="text-6xl mb-4 opacity-30">⬟</div>
                  <p className="text-muted-foreground">
                    Select exactly 5 exercises to view your performance pentagon
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Currently selected: {user.selectedStatsExercises.length}/5
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Settings */}
      <Card className="border-border bg-card/50 mt-6">
        <CardHeader>
          <CardTitle>User Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-xs">
            <Label htmlFor="bodyweight">Bodyweight (kg)</Label>
            <input
              id="bodyweight"
              type="number"
              min="0"
              step="0.1"
              value={user.bodyWeight}
              onChange={(e) =>
                updateUserStats('bodyWeight', parseFloat(e.target.value) || 0)
              }
              className="w-full mt-2 px-3 py-2 bg-muted border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Weight, Play } from 'lucide-react';
import { DashboardStats } from '@/components/DashboardStats';
import { AchievementBadges } from '@/components/AchievementBadges';
import { WeeklyChart } from '@/components/WeeklyChart';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const HistoryPage = () => {
  const { getLogs, data } = useData();
  const logs = getLogs();
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleQuickStart = () => {
    if (logs.length === 0) {
      toast.error('No previous workouts to restart');
      return;
    }
    navigate('/workout');
    toast.success('Ready to crush it! 💪');
  };

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="text-8xl mb-6 opacity-50 animate-float">▸</div>
        <h2 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          No Workouts Yet
        </h2>
        <p className="text-muted-foreground mb-8 text-lg">
          Start tracking your static holds and unlock achievements
        </p>
        <Button
          size="lg"
          onClick={() => navigate('/workout')}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Play className="h-5 w-5 mr-2" />
          Start Your First Workout
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
          Dashboard
        </h2>
        <Button
          onClick={handleQuickStart}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Play className="h-4 w-4 mr-2" />
          Quick Start
        </Button>
      </div>

      <DashboardStats />
      <AchievementBadges />
      
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <WeeklyChart />
        </div>
        <Card className="border-border bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg">Personal Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.availableExercises.slice(0, 5).map((exercise) => {
                const maxVolume = logs.reduce((max, log) => {
                  const exerciseData = log.exercises.find(e => e.name === exercise);
                  if (!exerciseData) return max;
                  
                  const volume = exerciseData.sets.reduce((total, set) => {
                    return Math.max(total, (data.user.bodyWeight + set.addedWeight) * set.time);
                  }, 0);
                  
                  return Math.max(max, volume);
                }, 0);

                return (
                  <div
                    key={exercise}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <span className="text-sm font-medium">{exercise}</span>
                    <span className="text-xs text-primary font-mono font-bold">
                      {maxVolume > 0 ? maxVolume : '--'}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-2xl font-bold mb-4">Recent Workouts</h3>
      <div className="space-y-4">
        {logs.map((log, index) => (
          <Card
            key={log.id}
            className="border-border bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl hover:scale-[1.02] transition-transform duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  {formatDate(log.date)}
                </CardTitle>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(log.date)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {log.exercises.map((exercise, idx) => (
                  <div
                    key={idx}
                    className="border-l-2 border-transparent bg-gradient-to-r from-primary/20 to-secondary/20 pl-4 py-2 rounded-r-lg"
                  >
                    <div className="font-semibold text-foreground mb-2">
                      {exercise.name}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      {exercise.sets.map((set, setIdx) => (
                        <div
                          key={setIdx}
                          className="flex items-center justify-between bg-muted/30 px-3 py-2 rounded"
                        >
                          <span className="text-muted-foreground">
                            Set {setIdx + 1}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {set.time}s
                            </span>
                            {set.addedWeight > 0 && (
                              <span className="flex items-center gap-1 text-primary">
                                <Weight className="h-3 w-3" />
                                +{set.addedWeight}kg
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

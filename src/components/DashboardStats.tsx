import { useData } from '@/context/DataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Clock, Flame, Trophy } from 'lucide-react';

export const DashboardStats = () => {
  const { getLogs, data } = useData();
  const logs = getLogs();

  const totalWorkouts = logs.length;
  
  const totalTimeUnderTension = logs.reduce((total, log) => {
    return total + log.exercises.reduce((exerciseTotal, exercise) => {
      return exerciseTotal + exercise.sets.reduce((setTotal, set) => {
        return setTotal + set.time;
      }, 0);
    }, 0);
  }, 0);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m ${seconds % 60}s`;
  };

  // Calculate streak
  const calculateStreak = () => {
    if (logs.length === 0) return 0;
    
    const sortedDates = logs
      .map(log => new Date(log.date).toDateString())
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    const uniqueDates = [...new Set(sortedDates)];
    let streak = 0;
    const today = new Date().toDateString();
    
    for (let i = 0; i < uniqueDates.length; i++) {
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - i);
      
      if (uniqueDates.includes(checkDate.toDateString())) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateStreak();

  const stats = [
    {
      icon: Activity,
      label: 'Total Workouts',
      value: totalWorkouts,
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Clock,
      label: 'Time Under Tension',
      value: formatTime(totalTimeUnderTension),
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${currentStreak} ${currentStreak === 1 ? 'day' : 'days'}`,
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Trophy,
      label: 'Favorite Exercise',
      value: logs.length > 0 ? getMostFrequentExercise() : 'None yet',
      gradient: 'from-yellow-500 to-amber-500',
    },
  ];

  function getMostFrequentExercise(): string {
    const exerciseCount: Record<string, number> = {};
    
    logs.forEach(log => {
      log.exercises.forEach(exercise => {
        exerciseCount[exercise.name] = (exerciseCount[exercise.name] || 0) + 1;
      });
    });

    const entries = Object.entries(exerciseCount);
    if (entries.length === 0) return 'None yet';
    
    return entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={stat.label}
            className="relative overflow-hidden border-border bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl animate-fade-in hover:scale-105 transition-transform duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
              </div>
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

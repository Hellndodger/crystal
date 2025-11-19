import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Zap, Target, Star, Crown, Rocket } from 'lucide-react';

interface Achievement {
  id: string;
  icon: typeof Award;
  title: string;
  description: string;
  requirement: number;
  gradient: string;
}

export const AchievementBadges = () => {
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

  const achievements: Achievement[] = [
    {
      id: 'first-workout',
      icon: Zap,
      title: 'First Step',
      description: 'Complete your first workout',
      requirement: 1,
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      id: 'ten-workouts',
      icon: Target,
      title: 'Consistent Athlete',
      description: 'Complete 10 workouts',
      requirement: 10,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      id: 'thirty-workouts',
      icon: Star,
      title: 'Dedicated Warrior',
      description: 'Complete 30 workouts',
      requirement: 30,
      gradient: 'from-orange-500 to-red-500',
    },
    {
      id: 'one-hour',
      icon: Award,
      title: 'Time Master',
      description: '1 hour total time under tension',
      requirement: 3600,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      id: 'five-hours',
      icon: Crown,
      title: 'Elite Performer',
      description: '5 hours total time under tension',
      requirement: 18000,
      gradient: 'from-yellow-500 to-amber-500',
    },
    {
      id: 'fifty-workouts',
      icon: Rocket,
      title: 'Unstoppable Force',
      description: 'Complete 50 workouts',
      requirement: 50,
      gradient: 'from-indigo-500 to-purple-500',
    },
  ];

  const isAchievementUnlocked = (achievement: Achievement) => {
    if (['first-workout', 'ten-workouts', 'thirty-workouts', 'fifty-workouts'].includes(achievement.id)) {
      return totalWorkouts >= achievement.requirement;
    }
    return totalTimeUnderTension >= achievement.requirement;
  };

  const unlockedCount = achievements.filter(isAchievementUnlocked).length;

  return (
    <Card className="border-border bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl mb-8 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Achievements
          </span>
          <span className="text-sm text-muted-foreground">
            {unlockedCount}/{achievements.length} Unlocked
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            const unlocked = isAchievementUnlocked(achievement);
            
            return (
              <div
                key={achievement.id}
                className={`relative group ${unlocked ? '' : 'opacity-40'}`}
              >
                <div
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    unlocked
                      ? `border-transparent bg-gradient-to-br ${achievement.gradient} hover:scale-110 animate-glow-pulse`
                      : 'border-dashed border-border bg-muted/20'
                  }`}
                >
                  <Icon className="h-8 w-8 text-white mx-auto" />
                </div>
                <div className="mt-2 text-center">
                  <p className="text-xs font-semibold">{achievement.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {achievement.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

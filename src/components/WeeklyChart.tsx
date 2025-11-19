import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

export const WeeklyChart = () => {
  const { getLogs, data } = useData();
  const logs = getLogs();

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toDateString(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        volume: 0,
      });
    }
    return days;
  };

  const weekData = getLast7Days();

  logs.forEach(log => {
    const logDate = new Date(log.date).toDateString();
    const dayEntry = weekData.find(day => day.date === logDate);
    
    if (dayEntry) {
      const dayVolume = log.exercises.reduce((total, exercise) => {
        return total + exercise.sets.reduce((setTotal, set) => {
          return setTotal + (data.user.bodyWeight + set.addedWeight) * set.time;
        }, 0);
      }, 0);
      dayEntry.volume += dayVolume;
    }
  });

  const maxVolume = Math.max(...weekData.map(d => d.volume), 1);

  return (
    <Card className="border-border bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Weekly Volume
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weekData}>
            <XAxis
              dataKey="dayName"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Bar dataKey="volume" radius={[8, 8, 0, 0]}>
              {weekData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#gradient${index})`}
                />
              ))}
            </Bar>
            <defs>
              {weekData.map((_, index) => (
                <linearGradient
                  key={`gradient${index}`}
                  id={`gradient${index}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="hsl(189, 95%, 51%)" />
                  <stop offset="100%" stopColor="hsl(265, 100%, 65%)" />
                </linearGradient>
              ))}
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

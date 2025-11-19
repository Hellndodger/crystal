import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Weight } from 'lucide-react';

export const HistoryPage = () => {
  const { getLogs } = useData();
  const logs = getLogs();

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

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4 opacity-50">▸</div>
        <h2 className="text-2xl font-bold mb-2">No Workouts Yet</h2>
        <p className="text-muted-foreground">
          Start tracking your static holds in the Workout tab
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Workout History</h2>
      <div className="space-y-4">
        {logs.map((log) => (
          <Card key={log.id} className="border-border bg-card/50">
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
                    className="border-l-2 border-primary pl-4 py-2"
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

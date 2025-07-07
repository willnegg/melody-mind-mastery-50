import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProgressStore } from '@/store/progressStore';
import ProgressBar from '@/components/ProgressBar';
import { scaleTypes, chordTypes } from '@/constants/musicTheory';

const Progress: React.FC = () => {
  const { 
    scales, 
    chords, 
    earTraining, 
    getStreakDays, 
    getCompletionPercentage,
    lastPracticeDate,
    totalPracticeTime
  } = useProgressStore();

  const streakDays = getStreakDays();
  const completionPercentage = getCompletionPercentage();

  const getScalesProgress = () => {
    const totalScales = Object.keys(scaleTypes).length * 12; // All scales in all keys
    const completedScales = Object.values(scales).filter(s => s.completed).length;
    return { completed: completedScales, total: totalScales };
  };

  const getChordsProgress = () => {
    const totalChords = Object.keys(chordTypes).length * 12; // All chords in all keys
    const completedChords = Object.values(chords).filter(c => c.completed).length;
    return { completed: completedChords, total: totalChords };
  };

  const getEarTrainingAverage = () => {
    const scores = Object.values(earTraining);
    const validScores = scores.filter(s => s.totalQuestions > 0);
    if (validScores.length === 0) return 0;
    
    const averageScore = validScores.reduce((sum, score) => 
      sum + (score.score / score.totalQuestions), 0) / validScores.length;
    return averageScore * 100;
  };

  const scalesProgress = getScalesProgress();
  const chordsProgress = getChordsProgress();
  const earTrainingAverage = getEarTrainingAverage();

  const stats = [
    {
      title: 'Current Streak',
      value: streakDays,
      unit: streakDays === 1 ? 'day' : 'days',
      color: 'text-primary'
    },
    {
      title: 'Overall Progress',
      value: completionPercentage,
      unit: '%',
      color: 'text-secondary'
    },
    {
      title: 'Practice Sessions',
      value: totalPracticeTime,
      unit: 'sessions',
      color: 'text-accent-foreground'
    },
    {
      title: 'Last Practice',
      value: lastPracticeDate ? new Date(lastPracticeDate).toLocaleDateString() : 'Never',
      unit: '',
      color: 'text-muted-foreground'
    }
  ];

  const categoryProgress = [
    {
      title: 'Scales',
      completed: scalesProgress.completed,
      total: scalesProgress.total,
      color: 'from-primary to-primary/60'
    },
    {
      title: 'Chords',
      completed: chordsProgress.completed,
      total: chordsProgress.total,
      color: 'from-secondary to-secondary/60'
    },
    {
      title: 'Ear Training',
      completed: earTrainingAverage,
      total: 100,
      color: 'from-accent to-accent/60',
      isPercentage: true
    }
  ];

  const recentActivity = [
    ...Object.entries(scales)
      .filter(([_, data]) => data.completed)
      .sort((a, b) => new Date(b[1].lastPracticed).getTime() - new Date(a[1].lastPracticed).getTime())
      .slice(0, 5)
      .map(([id, data]) => ({
        type: 'Scale',
        name: id.replace('-', ' '),
        date: data.lastPracticed,
        times: data.timesCompleted
      })),
    ...Object.entries(chords)
      .filter(([_, data]) => data.completed)
      .sort((a, b) => new Date(b[1].lastPracticed).getTime() - new Date(a[1].lastPracticed).getTime())
      .slice(0, 5)
      .map(([id, data]) => ({
        type: 'Chord',
        name: id.replace('-', ' '),
        date: data.lastPracticed,
        times: data.timesCompleted
      }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

  return (
    <div className="min-h-screen bg-background pb-20 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
          <p className="text-muted-foreground">
            Track your music theory learning journey
          </p>
        </header>

        <div className="space-y-6">
          {/* Stats Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.unit && `${stat.unit} `}{stat.title.toLowerCase()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Progress by Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {categoryProgress.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{category.title}</span>
                    <Badge variant="outline">
                      {category.isPercentage 
                        ? `${category.completed.toFixed(0)}%`
                        : `${category.completed}/${category.total}`
                      }
                    </Badge>
                  </div>
                  <ProgressBar 
                    progress={category.isPercentage ? category.completed / 100 : category.completed / category.total}
                    showPercentage={false}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Ear Training Details */}
          <Card>
            <CardHeader>
              <CardTitle>Ear Training Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(earTraining).map(([key, score]) => (
                  <div key={key} className="p-4 rounded-lg border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">{key}</span>
                      <Badge variant="secondary">
                        {score.totalQuestions > 0 
                          ? `${((score.score / score.totalQuestions) * 100).toFixed(0)}%`
                          : 'Not started'
                        }
                      </Badge>
                    </div>
                    {score.totalQuestions > 0 && (
                      <div className="text-sm text-muted-foreground">
                        <div>Best: {score.score}/{score.totalQuestions} correct</div>
                        {score.lastAttempt && (
                          <div>Last: {new Date(score.lastAttempt).toLocaleDateString()}</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          {recentActivity.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                      <div>
                        <span className="font-medium">{activity.name}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div>{new Date(activity.date).toLocaleDateString()}</div>
                        <div>{activity.times}x practiced</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;
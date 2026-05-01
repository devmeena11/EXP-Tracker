import React, { useMemo, useState } from 'react';
import Taskform from '../components/Taskform';
import Task from '../components/Task';
import Topbar from '../components/Topbar';
import LineChartCard from '../components/LineChartCard';
import DashboardHeatMap from '../components/DashboardHeatMap';
import { getDailyIntensityData } from '../utility/chartUtils';
import { getLocalDate } from '../utility/dateUtils';
import { getTaskInsights } from '../utility/taskUtils';

const Home = ({ tasklist, setTasklist}) => {
  const [toggle, setToggle] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const today = getLocalDate(new Date());

  const enhancedTasks = useMemo(() => (
    tasklist.map((task) => ({
      ...task,
      insights: getTaskInsights(task)
    }))
  ), [tasklist]);

  const summary = useMemo(() => {
    const completedToday = enhancedTasks.filter((task) => task.insights.completedToday).length;
    const averageWeeklyRate = enhancedTasks.length
      ? Math.round(
          enhancedTasks.reduce((total, task) => total + task.insights.weeklyRate, 0) / enhancedTasks.length
        )
      : 0;

    return {
      total: enhancedTasks.length,
      completedToday,
      averageWeeklyRate
    };
  }, [enhancedTasks]);

  const visibleTasks = useMemo(() => {
    const filtered = enhancedTasks.filter((task) => {
      if (filter === 'completed') {
        return task.insights.completedToday;
      }

      if (filter === 'active') {
        return task.insights.needsAttentionToday;
      }

      return true;
    });

    return [...filtered].sort((left, right) => {
      if (sortBy === 'name') {
        return left.name.localeCompare(right.name);
      }

      return (right.updatedAt || 0) - (left.updatedAt || 0);
    });
  }, [enhancedTasks, filter, sortBy]);

  const handleDelete = (id) => {
    const target = tasklist.find((task) => task.id === id);
    const confirmed = window.confirm(`Delete "${target?.name || 'this task'}"?`);

    if (!confirmed) {
      return;
    }

    setTasklist(tasklist.filter((task) => task.id !== id));
  };

  const handleCompleteToday = (id) => {
    setTasklist((prev) => prev.map((task) => {
      if (task.id !== id) {
        return task;
      }

      const index = task.completions.findIndex((completion) => completion.date === today);
      const completions = index === -1
        ? [...task.completions, { date: today, completed: true }]
        : task.completions.map((completion, completionIndex) => (
            completionIndex === index
              ? { ...completion, completed: true }
              : completion
          ));

      return {
        ...task,
        completions,
        updatedAt: Date.now()
      };
    }));
  };

  if (toggle) {
    return <Taskform setToggle={setToggle} toggle={toggle} setTasklist={setTasklist} />;
  }

  return (
    <div className='app-shell'>
      <div className='app-container flex flex-col gap-6'>
        <Topbar
          summary={summary}
          filter={filter}
          setFilter={setFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onAddTask={() => setToggle(true)}
        />

        {visibleTasks.length > 0 ? (
          <div className='grid gap-6 xl:grid-cols-[1.1fr,0.9fr]'>
            <LineChartCard
              title='Daily task intensity'
              subtitle='Visible tasks completed each day.'
              getDataForMode={(mode) => getDailyIntensityData(visibleTasks, mode)}
              color='#7c8cff'
              valueLabel='Completed tasks'
            />
            <DashboardHeatMap data={getDailyIntensityData(visibleTasks, "daily")} accentColor='#7c8cff' />
          </div>
        ) : null}

        {visibleTasks.length === 0 ? (
          <div className='panel flex flex-col items-start gap-4 p-8 md:p-10'>
            <span className='stat-pill'>No tasks in this view</span>
            <div className='space-y-2'>
              <h2 className='text-2xl font-semibold tracking-tight'>A quieter setup starts with one simple habit.</h2>
              <p className='max-w-xl text-sm text-[var(--text-secondary)]'>
                Create your first task or switch filters to see tasks that still need attention today.
              </p>
            </div>
            <button className='btn btn-primary' onClick={() => setToggle(true)}>Create your first task</button>
          </div>
        ) : (
          <div className='grid gap-4'>
            {visibleTasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                handleDelete={handleDelete}
                handleCompleteToday={handleCompleteToday}
                setTasklist={setTasklist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FiActivity, FiArrowLeft, FiCheckCircle, FiClock, FiTrendingUp } from "react-icons/fi";
import HeatMap from '../components/HeatMap.jsx';
import BarChartContainer from '../components/BarChartContainer';
import LineChartCard from '../components/LineChartCard';
import { withAlpha } from '../utility/colorUtils';
import { getTaskLineData } from '../utility/chartUtils';
import { getTaskAverages, getTaskInsights } from '../utility/taskUtils';

const TaskPage = ({tasklist}) => {
    const { state } = useLocation();
    const { id } = useParams();
    const task = state ?? tasklist.find(t => t.id.toString() === id);

    if (!task) {
        return (
            <div className='app-shell'>
                <div className='app-container'>
                    <div className='panel p-8'>
                        <h1 className='text-2xl font-semibold tracking-tight'>Task not found</h1>
                        <p className='mt-2 text-sm text-[var(--text-secondary)]'>This task may have been removed from your list.</p>
                        <Link className='btn btn-secondary mt-5' to='/'>
                            <FiArrowLeft />
                            Back to home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const averages = getTaskAverages(task);
    const insights = getTaskInsights(task);
    const metrics = [
      { label: 'Total score', value: `${averages.total}%` },
      { label: 'This week', value: `${averages.week}%` },
      { label: 'This month', value: `${averages.month}%` },
      { label: 'This year', value: `${averages.year}%` }
    ];

    return (
        <div className='app-shell'>
            <div className='app-container flex flex-col gap-6 overflow-x-hidden'>
                <Link className='btn btn-secondary self-start' to='/'>
                    <FiArrowLeft />
                    Back to home
                </Link>

                <div className='panel p-6 md:p-8'>
                    <div className='flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between'>
                        <div className='space-y-4'>
                            <div className='flex items-center gap-3'>
                                <span
                                    className='h-3 w-3 rounded-full'
                                    style={{
                                        backgroundColor: task.color,
                                        boxShadow: `0 0 0 6px ${withAlpha(task.color, 0.14)}`
                                    }}
                                />
                                <span
                                    className='stat-pill'
                                    style={{
                                        color: task.color,
                                        borderColor: withAlpha(task.color, 0.28),
                                        backgroundColor: withAlpha(task.color, 0.1)
                                    }}
                                >
                                    <FiTrendingUp />
                                    Accent in focus
                                </span>
                            </div>

                            <div className='space-y-2'>
                                <h1 className='text-3xl font-semibold tracking-tight md:text-4xl'>{task.name}</h1>
                                <p className='max-w-2xl text-sm leading-6 text-[var(--text-secondary)]'>
                                    {task.description?.trim() || 'A simple ritual worth tracking over time.'}
                                </p>
                                {task.question ? (
                                    <p className='text-sm text-[var(--text-secondary)]'>Prompt: {task.question}</p>
                                ) : null}
                            </div>
                        </div>

                        <div className='grid gap-3 sm:grid-cols-3 lg:w-[420px]'>
                            <div className='metric-card'>
                                <p className='text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]'>Today</p>
                                <p className='mt-3 text-lg font-semibold'>
                                    {insights.completedToday ? 'Completed' : 'Needs attention'}
                                </p>
                            </div>
                            <div className='metric-card'>
                                <p className='text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]'>Current streak</p>
                                <p className='mt-3 text-lg font-semibold'>{insights.currentStreak} days</p>
                            </div>
                            <div className='metric-card'>
                                <p className='text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]'>Best streak</p>
                                <p className='mt-3 text-lg font-semibold'>{insights.longestStreak} days</p>
                            </div>
                        </div>
                    </div>

                    <div className='mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
                        {metrics.map((metric) => (
                            <div key={metric.label} className='metric-card'>
                                <p className='text-sm text-[var(--text-secondary)]'>{metric.label}</p>
                                <p className='mt-2 text-2xl font-semibold'>{metric.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className='mt-5 flex flex-wrap gap-2'>
                        <span className='stat-pill'>
                            <FiCheckCircle />
                            Weekly score {insights.weeklyRate}%
                        </span>
                        <span className='stat-pill'>
                            <FiClock />
                            Last done {insights.lastCompletedDate ? new Date(insights.lastCompletedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'not yet'}
                        </span>
                        <span className='stat-pill'>
                            <FiActivity />
                            Overall score {insights.totalRate}%
                        </span>
                    </div>
                </div>

                <LineChartCard
                  title='Completion line'
                  subtitle='Switch between daily, weekly, monthly, and yearly totals for this task.'
                  getDataForMode={(mode) => getTaskLineData(task, mode)}
                  color={task.color}
                  valueLabel='Completed'
                  valueFormatter={(value, mode) => (
                    mode === "daily"
                      ? (value === 1 ? 'Done' : 'Not done')
                      : `${value} completions`
                  )}
                />

                <div className='grid min-w-0 gap-6 xl:grid-cols-[1.1fr,0.9fr]'>
                    <HeatMap task={task}/>
                    <BarChartContainer task={task}/>
                </div>
            </div>
        </div>
    );
}

export default TaskPage;

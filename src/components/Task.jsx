import React from 'react';
import { Link  } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiClock, FiTarget, FiTrendingUp, FiZap } from "react-icons/fi";
import { weeklist } from '../assets/assets';
import CheckBox from './CheckBox';
import { withAlpha } from '../utility/colorUtils';

const formatLastCompleted = (value) => {
  if (!value) {
    return 'Not completed yet';
  }

  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

const Task = ({ task, handleDelete, handleCompleteToday, setTasklist }) => {
  const orderedWeek = [...weeklist].reverse();

  return (
    <div className='panel panel-hover p-5 md:p-6'>
      <div className='flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between'>
        <div className='min-w-0 flex-1 space-y-4'>
          <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
            <div className='min-w-0 space-y-3'>
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
                  {task.insights.weeklyRate}% this week
                </span>
              </div>

              <div className='min-w-0 space-y-2'>
                <Link className='inline-flex items-center gap-2 text-xl font-semibold tracking-tight md:text-2xl' to={`/task/${task.id}`} state={task}>
                  <span className='truncate'>{task.name}</span>
                  <FiArrowRight className='shrink-0 text-[var(--text-secondary)]' />
                </Link>
                <p className='max-w-2xl text-sm leading-6 text-[var(--text-secondary)]'>
                  {task.description?.trim() || 'A quiet daily habit with room to build momentum.'}
                </p>
              </div>
            </div>

            <div className='flex flex-wrap gap-2'>
              <button
                className='btn btn-secondary'
                onClick={() => handleCompleteToday(task.id)}
                disabled={task.insights.completedToday}
              >
                <FiCheckCircle />
                {task.insights.completedToday ? 'Done today' : 'Mark today done'}
              </button>
              <button className='btn btn-danger' onClick={() => handleDelete(task.id)}>
                Delete
              </button>
            </div>
          </div>

          <div className='grid gap-2 sm:grid-cols-2 xl:grid-cols-4'>
            <div className='stat-pill justify-between'>
              <span className='inline-flex items-center gap-2'>
                <FiZap />
                Current streak
              </span>
              <strong className='text-[var(--text-primary)]'>{task.insights.currentStreak}d</strong>
            </div>
            <div className='stat-pill justify-between'>
              <span className='inline-flex items-center gap-2'>
                <FiTarget />
                Best streak
              </span>
              <strong className='text-[var(--text-primary)]'>{task.insights.longestStreak}d</strong>
            </div>
            <div className='stat-pill justify-between'>
              <span className='inline-flex items-center gap-2'>
                <FiClock />
                Last done
              </span>
              <strong className='text-[var(--text-primary)]'>{formatLastCompleted(task.insights.lastCompletedDate)}</strong>
            </div>
            <div
              className='stat-pill justify-between'
              style={{
                borderColor: task.insights.completedToday ? withAlpha(task.color, 0.28) : undefined,
                backgroundColor: task.insights.completedToday ? withAlpha(task.color, 0.12) : undefined
              }}
            >
              <span>Today</span>
              <strong style={{ color: task.insights.completedToday ? task.color : 'var(--text-primary)' }}>
                {task.insights.completedToday ? 'Completed' : 'Needs attention'}
              </strong>
            </div>
          </div>
        </div>

        <div className='w-full xl:max-w-[360px]'>
          <div
            className='rounded-[1.25rem] border p-4'
            style={{
              borderColor: 'rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(0,0,0,0.1)'
            }}
          >
            <div className='mb-3 flex items-center justify-between'>
              <p className='text-sm font-medium text-[var(--text-secondary)]'>Last 7 days</p>
              <Link className='text-sm font-medium text-[var(--text-secondary)] transition hover:text-white' to={`/task/${task.id}`} state={task}>
                View details
              </Link>
            </div>

            <div className='grid grid-cols-7 gap-2'>
              {orderedWeek.map((day) => (
                <CheckBox key={day.dateString} day={day} task={task} setTasklist={setTasklist} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Task;

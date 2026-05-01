import React from 'react';
import { FiArrowUpRight, FiCalendar, FiCheckCircle, FiPlus } from "react-icons/fi";
import { weeklist } from '../assets/assets';

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Active today', value: 'active' },
  { label: 'Completed today', value: 'completed' }
];

const Topbar = ({ summary, filter, setFilter, sortBy, setSortBy, onAddTask }) => {
  const orderedWeek = [...weeklist].reverse();

  return (
    <div className='flex flex-col gap-4'>
      <div className='panel p-6 md:p-7'>
        <div className='flex flex-col gap-5 md:flex-row md:items-start md:justify-between'>
          <div className='space-y-3'>
            <span className='stat-pill'>
              <FiCalendar />
              Gentle daily rhythm
            </span>
            <div className='space-y-2'>
              <h1 className='text-3xl font-semibold tracking-tight md:text-4xl'>Habit tracker, softened for focus.</h1>
              <p className='max-w-2xl text-sm leading-6 text-[var(--text-secondary)] md:text-base'>
                Keep an eye on today, keep the week in view, and let each task use color as a quiet accent instead of visual noise.
              </p>
            </div>
          </div>

          <button className='btn btn-primary self-start' onClick={onAddTask}>
            <FiPlus />
            Add new task
          </button>
        </div>

        <div className='mt-6 grid gap-3 md:grid-cols-3'>
          <div className='metric-card'>
            <p className='text-sm text-[var(--text-secondary)]'>Tasks tracked</p>
            <p className='mt-2 text-2xl font-semibold'>{summary.total}</p>
          </div>
          <div className='metric-card'>
            <p className='text-sm text-[var(--text-secondary)]'>Completed today</p>
            <p className='mt-2 text-2xl font-semibold'>{summary.completedToday}</p>
          </div>
          <div className='metric-card'>
            <p className='text-sm text-[var(--text-secondary)]'>Average weekly score</p>
            <p className='mt-2 text-2xl font-semibold'>{summary.averageWeeklyRate}%</p>
          </div>
        </div>
      </div>

      <div className='panel p-4 md:p-5'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          <div className='flex flex-col gap-3'>
            <p className='text-sm font-medium text-[var(--text-secondary)]'>This week</p>
            <div className='grid grid-cols-4 gap-2 sm:grid-cols-7'>
              {orderedWeek.map((day) => {
                const label = new Date(day.dateString).toLocaleDateString('en-US', { weekday: 'short' });
                return (
                  <div key={day.dateString} className='rounded-2xl border border-[var(--border)] bg-white/5 px-3 py-2 text-center'>
                    <p className='text-xs font-medium text-[var(--text-secondary)]'>{label}</p>
                    <p className='mt-1 text-sm font-semibold'>{day.date}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className='flex flex-col gap-3 md:flex-row md:items-center'>
            <div className='flex flex-wrap gap-2'>
              {filters.map((item) => (
                <button
                  key={item.value}
                  className={`btn ${filter === item.value ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setFilter(item.value)}
                >
                  {item.value === 'completed' ? <FiCheckCircle /> : <FiArrowUpRight />}
                  {item.label}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className='input-select min-w-[190px]'
            >
              <option value='recent'>Sort: Recently updated</option>
              <option value='name'>Sort: Name</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;

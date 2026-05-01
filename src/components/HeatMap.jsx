import React from 'react';
import { FiCalendar, FiCheckCircle, FiMinusCircle, FiSquare } from "react-icons/fi";
import { withAlpha } from '../utility/colorUtils';
import { formatShortDate } from '../utility/dateUtils';
import { getBinaryHeatmapData, getHeatmapOverview, getTaskHeatmapData } from '../utility/heatmapUtils';

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const HeatMap = ({ task }) => {
    const entries = getTaskHeatmapData(task);
    const months = getBinaryHeatmapData(task);
    const overview = getHeatmapOverview(entries);

    const getColor = (value) => {
        if (value === -1) return 'transparent';
        if (value === 0) return 'rgba(255,255,255,0.07)';
        return withAlpha(task?.color, 0.9);
    };

    if (!months.length) {
        return (
            <div className="panel min-w-0 p-5 md:p-6">
                <div className='flex flex-col gap-3'>
                    <h2 className='section-title'>Completion heatmap</h2>
                    <p className='section-subtitle'>No history yet. As days are tracked, the calendar will fill in here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="panel min-w-0 p-5 md:p-6">
            <div className='mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
                <div>
                    <h2 className='section-title'>Completion heatmap</h2>
                    <p className='section-subtitle'>A full calendar view from the task start date to today, with calmer states for empty and missed days.</p>
                </div>

                <div className='flex flex-wrap gap-2'>
                    <span className='stat-pill'><FiCheckCircle /> Done</span>
                    <span className='stat-pill'><FiMinusCircle /> Missed</span>
                    <span className='stat-pill'><FiSquare /> Outside month</span>
                </div>
            </div>

            <div className='mb-5 grid gap-3 sm:grid-cols-3'>
                <div className='metric-card'>
                    <p className='text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]'>Range</p>
                    <p className='mt-2 text-sm font-medium'>
                        {overview.startDate ? `${formatShortDate(overview.startDate)} - ${formatShortDate(overview.endDate)}` : 'No data'}
                    </p>
                </div>
                <div className='metric-card'>
                    <p className='text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]'>Completed days</p>
                    <p className='mt-2 text-2xl font-semibold'>{overview.activeDays}</p>
                </div>
                <div className='metric-card'>
                    <p className='text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]'>Months tracked</p>
                    <p className='mt-2 text-2xl font-semibold'>{months.length}</p>
                </div>
            </div>

            <div className="flex min-w-0 grid-cols-[auto,1fr] items-start gap-4">
                <div className="mt-16 inline-grid max-w-fit gap-1.5 text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                    {weekdayLabels.map((label) => (
                        <span key={label} className="inline-flex h-4 max-w-fit items-center">{label}</span>
                    ))}
                </div>

                <div className="w-full overflow-x-auto pb-1">
                    <div className="inline-flex min-w-fit gap-4 pr-1">
                        {months.map((month) => (
                            <div
                                key={month.key}
                                className='inline-flex min-w-[8.75rem] flex-col gap-3 rounded-[1.5rem] border px-3 py-4'
                                style={{
                                    borderColor: 'rgba(255,255,255,0.08)',
                                    backgroundColor: 'rgba(255,255,255,0.03)'
                                }}
                            >
                                <div className='flex items-center justify-between gap-3'>
                                    <div>
                                        <div className='text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]'>{month.label}</div>
                                        <div className='mt-1 text-[11px] text-[var(--text-secondary)]'>{month.days.filter((day) => day.value > 0).length} completed days</div>
                                    </div>
                                    <span
                                        className='flex h-9 w-9 items-center justify-center rounded-full border'
                                        style={{
                                            borderColor: withAlpha(task?.color, 0.22),
                                            backgroundColor: withAlpha(task?.color, 0.08),
                                            color: task?.color
                                        }}
                                    >
                                        <FiCalendar size={14} />
                                    </span>
                                </div>

                                <div className='inline-flex gap-1.5'>
                                    {month.weeks.map((week, weekIndex) => (
                                        <div key={`${month.key}-${weekIndex}`} className="flex flex-col gap-1.5">
                                            {week.map((day, dayIndex) => (
                                                <div
                                                    key={`${month.key}-${weekIndex}-${day.date ?? dayIndex}`}
                                                    title={day.date ? `${day.date}: ${day.value === 1 ? 'Completed' : 'Missed'}` : 'Outside current month'}
                                                    style={{
                                                        backgroundColor: getColor(day.value),
                                                        borderColor: day.value === -1 ? 'transparent' : day.isToday ? withAlpha(task?.color, 0.85) : withAlpha(task?.color, 0.15),
                                                        boxShadow: day.isToday ? `0 0 0 2px ${withAlpha(task?.color, 0.18)}` : 'none'
                                                    }}
                                                    className='h-4 w-4 rounded-[5px] border transition-all duration-150 hover:scale-110'
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeatMap;

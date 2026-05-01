import React from 'react';
import { FiActivity, FiCalendar, FiLayers } from "react-icons/fi";
import { withAlpha } from '../utility/colorUtils';
import { formatShortDate } from '../utility/dateUtils';
import { getHeatmapOverview, getIntensityHeatmapColor, shapeHeatmapData } from '../utility/heatmapUtils';

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DashboardHeatMap = ({ data, accentColor = "#7c8cff" }) => {
    const shaped = shapeHeatmapData(data);
    const overview = getHeatmapOverview(data);
    const maxValue = overview.peakValue;

    if (!shaped.length) {
        return (
            <div className="panel p-5 md:p-6 min-w-0">
                <div className='flex flex-col gap-3'>
                    <h2 className='section-title'>Daily intensity heatmap</h2>
                    <p className='section-subtitle'>No visible task activity yet. The dashboard heatmap will appear as soon as days are tracked.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="panel p-5 md:p-6 min-w-0">
            <div className='mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
                <div>
                    <h2 className='section-title'>Daily intensity heatmap</h2>
                    <p className='section-subtitle'>Visible task activity per day, with deeper color showing busier completion days.</p>
                </div>

                <div className='flex flex-wrap gap-2'>
                    <span className='stat-pill'><FiCalendar /> Quiet</span>
                    <span className='stat-pill'><FiActivity /> Higher intensity</span>
                    <span className='stat-pill'><FiLayers /> Peak {maxValue}</span>
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
                    <p className='text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]'>Active days</p>
                    <p className='mt-2 text-2xl font-semibold'>{overview.activeDays}</p>
                </div>
                <div className='metric-card'>
                    <p className='text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]'>Total completions</p>
                    <p className='mt-2 text-2xl font-semibold'>{overview.totalValue}</p>
                </div>
            </div>

            <div className="flex min-w-0 grid-cols-[auto,1fr] items-start gap-4">
                <div className="mt-16 grid gap-1.5 text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                    {weekdayLabels.map((label) => (
                        <span key={label} className="flex h-4 items-center">{label}</span>
                    ))}
                </div>

                <div className="w-full overflow-x-auto pb-1">
                    <div className="inline-flex min-w-fit gap-4 pr-1">
                        {shaped.map((month) => (
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
                                        <div className='mt-1 text-[11px] text-[var(--text-secondary)]'>{month.days.reduce((total, day) => total + day.value, 0)} completions</div>
                                    </div>
                                    <span
                                        className='flex h-9 w-9 items-center justify-center rounded-full border'
                                        style={{
                                            borderColor: withAlpha(accentColor, 0.22),
                                            backgroundColor: withAlpha(accentColor, 0.08),
                                            color: accentColor
                                        }}
                                    >
                                        <FiActivity size={14} />
                                    </span>
                                </div>

                                <div className='inline-flex gap-1.5'>
                                    {month.weeks.map((week, weekIndex) => (
                                        <div key={`${month.key}-${weekIndex}`} className="flex flex-col gap-1.5">
                                            {week.map((day, dayIndex) => (
                                                <div
                                                    key={`${month.key}-${weekIndex}-${day.date ?? dayIndex}`}
                                                    title={day.date ? `${day.date}: ${day.value} completions` : 'Outside current month'}
                                                    style={{
                                                        backgroundColor: getIntensityHeatmapColor(day.value, accentColor, maxValue),
                                                        borderColor: day.value === -1 ? 'transparent' : day.isToday ? withAlpha(accentColor, 0.8) : withAlpha(accentColor, 0.15),
                                                        boxShadow: day.isToday ? `0 0 0 2px ${withAlpha(accentColor, 0.16)}` : 'none'
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

export default DashboardHeatMap;

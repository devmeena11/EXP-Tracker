import React from 'react';
import { FiCheck, FiMinus } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { getLocalDate } from '../utility/dateUtils';
import { withAlpha } from '../utility/colorUtils';

const CheckBox = ({ day, task, setTasklist }) => {
    const completion = task.completions.find(
        (c) => c.date === day.dateString
    );

    const today = getLocalDate(new Date());
    const status = completion
        ? (completion.completed ? 'done' : (day.dateString === today ? 'pending' : 'missed'))
        : 'not-tracked';

    const handleToggle = () => {
        setTasklist(prev =>
            prev.map(t => {
                if (t.id !== task.id) return t;
                const index = t.completions.findIndex(c => c.date === day.dateString );
                const updatedCompletions = index !== -1
                    ? t.completions.map((completionValue, completionIndex) => (
                        completionIndex === index ? { ...completionValue, completed: !completionValue.completed } : completionValue
                    ))
                    : [...t.completions, { date: day.dateString, completed: true }];

                return {
                    ...t,
                    completions: updatedCompletions,
                    updatedAt: Date.now()
                };
            })
        );
    };

    const icon = {
      done: <FiCheck size={14} />,
      pending: <FiMinus size={14} />,
      missed: <RxCross2 size={14} />,
      'not-tracked': <FiMinus size={14} />
    }[status];

    const title = {
      done: `Completed on ${day.dateString}`,
      pending: `Pending for ${day.dateString}`,
      missed: `Missed on ${day.dateString}`,
      'not-tracked': `Not tracked on ${day.dateString}`
    }[status];

    const styles = {
      done: {
        backgroundColor: withAlpha(task.color, 0.18),
        borderColor: withAlpha(task.color, 0.44),
        color: task.color,
        boxShadow: `0 0 0 4px ${withAlpha(task.color, 0.12)}`
      },
      pending: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderColor: withAlpha(task.color, 0.28),
        color: 'var(--text-secondary)'
      },
      missed: {
        backgroundColor: 'rgba(214,103,103,0.08)',
        borderColor: 'rgba(214,103,103,0.24)',
        color: '#fda4af'
      },
      'not-tracked': {
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,0.08)',
        color: 'var(--text-secondary)'
      }
    }[status];

    return (
        <button
            type='button'
            title={title}
            onClick={handleToggle}
            className='group flex flex-col items-center gap-2 text-center'
        >
            <span
                style={styles}
                className='flex h-10 w-10 items-center justify-center rounded-2xl border text-sm transition duration-200 group-hover:scale-[1.04] group-focus-visible:scale-[1.04]'
            >
                {icon}
            </span>
            <span className='text-[11px] font-medium text-[var(--text-secondary)]'>{day.date}</span>
        </button>
    );
};

export default CheckBox;

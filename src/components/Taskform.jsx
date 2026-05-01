import React, { useEffect, useState } from 'react';
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import Colourpicker from './Colourpicker';
import { withAlpha } from '../utility/colorUtils';
import { readLocalStorageValue, writeLocalStorageValue } from '../utility/storageUtils';

const Taskform = ({ setToggle, toggle, setTasklist }) => {
    const [color, setColor] = useState('#ffffff');
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [question, setQuestion] = useState("");

    const getToday = () =>
        new Date().toISOString().split("T")[0];

    const handleAdd = () => {
        if (!name.trim()) return;
        const now = Date.now();
        const today = getToday();

        const newTask = {
            id: now,
            name,
            description,
            question,
            color,
            createdAt: now,
            updatedAt: now,
            isActive: true,
            streak: 0,
            longestStreak: 0,
            completions: [
                { date: today, completed: false }
            ]
        };

        setTasklist((prev) => [...prev, newTask]);
        setToggle(!toggle);
    };

    useEffect(() => {
        const temp = readLocalStorageValue("color", "");
        if (temp) setColor(temp);
    }, []);

    const handleColorSelect = (selectedColor) => {
        setColor(selectedColor);
        writeLocalStorageValue("color", selectedColor);
    };

    return (
        <div className='app-shell'>
            <div className='app-container flex min-h-[100lvh] items-center justify-center'>
                <div className='panel w-full max-w-3xl p-6 md:p-8'>
                    <div className='flex flex-col gap-6'>
                        <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
                            <div className='space-y-2'>
                                <span className='stat-pill'>
                                    <FiCheckCircle />
                                    New habit card
                                </span>
                                <h1 className='text-3xl font-semibold tracking-tight'>Create something calm enough to keep.</h1>
                                <p className='max-w-2xl text-sm leading-6 text-[var(--text-secondary)]'>
                                    Give the task a clear name, a little context, and one accent color that will quietly follow it across the app.
                                </p>
                            </div>

                            <button className='btn btn-secondary self-start' onClick={() => setToggle(!toggle)}>
                                <FiArrowLeft />
                                Go back
                            </button>
                        </div>

                        <div className='grid gap-5 md:grid-cols-2'>
                            <label className='flex flex-col gap-2'>
                                <span className='text-sm font-medium'>Task name</span>
                                <input
                                    className='input-field'
                                    type="text"
                                    value={name}
                                    placeholder='Morning walk'
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <span className='text-xs text-[var(--text-secondary)]'>Required. Keep it short and easy to scan.</span>
                            </label>

                            <label className='flex flex-col gap-2'>
                                <span className='text-sm font-medium'>Daily prompt</span>
                                <input
                                    className='input-field'
                                    type="text"
                                    value={question}
                                    placeholder='Did you go for your walk?'
                                    onChange={(e) => setQuestion(e.target.value)}
                                />
                                <span className='text-xs text-[var(--text-secondary)]'>Optional. Helpful if you want a more human reminder.</span>
                            </label>
                        </div>

                        <label className='flex flex-col gap-2'>
                            <span className='text-sm font-medium'>Description</span>
                            <textarea
                                className='input-area'
                                value={description}
                                placeholder='A light routine to start the day with more energy.'
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <span className='text-xs text-[var(--text-secondary)]'>Optional. Add context that makes the habit easier to remember.</span>
                        </label>

                        <div
                            className='rounded-[1.5rem] border p-4 md:p-5'
                            style={{
                                borderColor: 'rgba(255,255,255,0.08)',
                                backgroundColor: 'rgba(255,255,255,0.04)'
                            }}
                        >
                            <div className='mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                                <div>
                                    <p className='text-sm font-medium'>Accent color</p>
                                    <p className='text-xs text-[var(--text-secondary)]'>This color appears in charts, status pills, and completion states.</p>
                                </div>
                                <div
                                    className='inline-flex items-center gap-3 rounded-full border px-3 py-2 text-sm'
                                    style={{
                                        borderColor: withAlpha(color, 0.28),
                                        backgroundColor: withAlpha(color, 0.1)
                                    }}
                                >
                                    <span className='h-3 w-3 rounded-full' style={{ backgroundColor: color }} />
                                    Selected accent
                                </div>
                            </div>

                            <Colourpicker selectedColor={color} onSelectColor={handleColorSelect} />
                        </div>

                        <div className='flex flex-col gap-3 sm:flex-row sm:justify-end'>
                            <button className='btn btn-secondary' onClick={() => setToggle(!toggle)}>Cancel</button>
                            <button className='btn btn-primary' disabled={!name.trim()} onClick={handleAdd}>Add task</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Taskform;

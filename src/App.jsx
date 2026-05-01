import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/App.css';
import Home from './pages/Home';
import TaskPage from './pages/TaskPage';
import { fillMissingDates } from './utility/taskUtils';
import { readLocalStorage, writeLocalStorage } from './utility/storageUtils';

const App = () => {
  const [tasklist, setTasklist] = useState(() => {
    const temp = readLocalStorage('tasklist', []);
    return Array.isArray(temp) ? temp.map((task) => fillMissingDates(task)) : [];
  });

  useEffect(() => {
    writeLocalStorage('tasklist', tasklist);
  }, [tasklist]);

  return (
    <Routes>
      <Route path="/" element={<Home tasklist={tasklist} setTasklist={setTasklist} />} />
      <Route path="/task/:id" element={<TaskPage tasklist={tasklist} setTasklist={setTasklist} />} />
    </Routes>
  );
}

export default App;

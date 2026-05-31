//App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SubjectProvider } from './context/SubjectContext';
import Header from './components/Header';
import Main from './pages/Main';
import History from './pages/History';
import Dashboard from './pages/Dashboard';
import { TimerProvider } from './context/TimerContext';

// App.js
function App() {
  return (
    <SubjectProvider>
      <TimerProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/history" element={<History />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
       </BrowserRouter>
      </TimerProvider>
    </SubjectProvider>
  );
}

export default App;
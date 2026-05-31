import React, { createContext, useState, useEffect, useRef, useContext,useCallback } from 'react';
import * as api from '../api';
import * as utils from '../utils';
import { SubjectContext } from './SubjectContext';

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const { subjects } = useContext(SubjectContext);

  const alarmRef = useRef(new Audio('/sounds/alarm.mp3'));
  
  const playAlarm = useCallback(() => {
    alarmRef.current.loop = true;
    alarmRef.current.play().catch(e => console.error("알람 재생 실패:", e));
  }, []);

  const stopAlarm = useCallback(() => {
    alarmRef.current.pause();
    alarmRef.current.currentTime = 0; // 재생 위치를 0으로 돌려놓음
  }, []);
  
  // 상태 관리
  const [selectedSubject, setSelectedSubject] = useState(() => {
    const saved = localStorage.getItem('selectedSubject');
    return saved ? JSON.parse(saved) : null;
  });
  const [time, setTime] = useState({ hours: 0, minutes: 25, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const targetTimeRef = useRef(0);

  // 로직들 (Main.js에서 복사)
  const toggleTimer = () => {
    if (!isRunning) {
      const total = (time.hours * 3600) + (time.minutes * 60) + time.seconds;
      targetTimeRef.current = total;
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setPercentage(0);
    targetTimeRef.current = 0;
    setTime({ hours: 0, minutes: 25, seconds: 0 });
  };

  const finishStudy = useCallback(async (duration, subjectId, subjectName) => {
    setIsRunning(false);
    setPercentage(0);
    
    // 알람 시작!
    playAlarm(); 
    
    if (subjectId) {
      await api.saveSessionApi(subjectId, subjectName, duration);
    }
    utils.showBreakTimer(5, stopAlarm);
  }, [playAlarm,stopAlarm]);

  // 타이머 로직 (useEffect)
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTime(prev => {
        let totalSecondsRemaining = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        const target = targetTimeRef.current;
        const newPercentage = target > 0 ? ((target - totalSecondsRemaining) / target) * 100 : 0;
        setPercentage(newPercentage);

        if (totalSecondsRemaining <= 0) {
          finishStudy();
          return { hours: 0, minutes: 0, seconds: 0 };
        }
        return { 
          hours: Math.floor(totalSecondsRemaining / 3600), 
          minutes: Math.floor((totalSecondsRemaining % 3600) / 60), 
          seconds: totalSecondsRemaining % 60 
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  // localStorage 저장
  useEffect(() => {
    if (selectedSubject) localStorage.setItem('selectedSubject', JSON.stringify(selectedSubject));
    else localStorage.removeItem('selectedSubject');
  }, [selectedSubject]);

  return (
    <TimerContext.Provider value={{ 
      time, setTime, isRunning, toggleTimer, resetTimer, 
      percentage, selectedSubject, setSelectedSubject,playAlarm,stopAlarm
    }}>
      {children}
    </TimerContext.Provider>
  );
};
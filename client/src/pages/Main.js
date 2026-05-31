import React, { useContext } from 'react';
import { SubjectContext } from '../context/SubjectContext';
import { TimerContext } from '../context/TimerContext'; // TimerContext import 추가
import * as utils from '../utils'; 
import * as api from '../api';
import TimerInput from '../components/TimerInput';
import './Main.css';

function Main() {
  const { subjects, setSubjects } = useContext(SubjectContext);
  
  // 1. Context에서 필요한 모든 상태와 함수를 가져옵니다.
  const { 
    time, setTime, isRunning, toggleTimer, resetTimer, 
    percentage, selectedSubject, setSelectedSubject 
  } = useContext(TimerContext);

  const handleAddSubject = async (name) => {
    const data = await api.addSubjectApi(name);
    if (data.success && data.new_subject) {
      setSubjects([...subjects, data.new_subject]);
    }
  };


  const handleDeleteSubject = async (id) => {
    const data = await api.deleteSubjectApi(id);
    if (data.success) {
      setSubjects(subjects.filter(s => s.id !== id));
      if (selectedSubject?.id === parseInt(id)) setSelectedSubject(null);
    }
  };

  const handleManageSubjects = () => {
    utils.showSubjectManager(
      subjects, 
      selectedSubject, 
      (sub) => {
        setSelectedSubject(sub);
      }, 
      handleDeleteSubject, 
      handleAddSubject
    );
  };

  return (
    <div className="timer-container" style={{ textAlign: 'center', padding: '50px' }}>
      
      {/* 과목명 영역 */}
      <button className='subject-button'
        onClick={handleManageSubjects}>
        {selectedSubject ? selectedSubject.name : '과목을 선택하세요'}
      </button>

      {/* 원형 타이머 및 숫자 영역 */}
      <div className="circular-timer" style={{
        width: '800px', height: '800px', borderRadius: '50%',
        border: '5px solid black', margin: '0 auto',
        background: `conic-gradient(red ${percentage}%, #ffffff ${percentage}%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative'
      }}>
        <div className="timer-text" style={{ 
          fontSize: '48px', color: 'black',
          borderRadius: '50%', padding: '40px', width: '400px', height: '400px',
          backgroundColor: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1
        }}>
          {/* 타이머 시간 출력 */}
          <TimerInput time={time} setTime={setTime} />
        </div>
      </div>

      {/* 컨트롤 버튼 영역 */}
      <div className="controls" style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '30px' }}>
        <button className="control-button" onClick={toggleTimer}>
          <img 
            src={isRunning ? process.env.PUBLIC_URL + "/images/pause-solid-full.svg" : process.env.PUBLIC_URL + "/images/play-solid-full.svg"} 
            alt={isRunning ? "일시정지" : "재생"} 
            className="control-icon" 
            style={{ width: '40px', height: '40px', display: 'block' }}
          />
        </button>

        {/* 정지 버튼 */}
        <button className="control-button" onClick={resetTimer}>
          <img 
            src={process.env.PUBLIC_URL +  "/images/stop-solid-full.svg"} 
            alt="정지" 
            className="control-icon" 
          />
        </button>
      </div>
    </div>
  );
}

export default Main;
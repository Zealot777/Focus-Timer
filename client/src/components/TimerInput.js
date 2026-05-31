import React, { useState, useEffect,useRef } from 'react';

function TimerInput({ time, setTime }) {
  // 입력 중인 상태를 별도로 관리하지 않고, 포커스 상태만 활용합니다.
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    const container = containerRef.current;

    const handleWheel = (e) => {
      // 1. 이벤트가 발생한 대상(target)이 input인지 확인
      const unit = e.target.getAttribute('data-unit');
      
      // unit이 없으면(input 밖에서 스크롤하면) 무시
      if (!unit) return;

      // 2. 기본 스크롤 막기
      e.preventDefault();

      const delta = e.deltaY < 0 ? 1 : -1;
      const max = unit === 'hours' ? 99 : 59;
      
      setTime(prev => {
        let newValue = prev[unit] + delta;
        if (newValue < 0) newValue = max;
        if (newValue > max) newValue = 0;
        return { ...prev, [unit]: newValue };
      });
    };

    // 3. 부모 컨테이너에만 이벤트 등록 (passive: false로 스크롤 방지)
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    // 4. 정리 (cleanup)
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [setTime]);

  const handleChange = (e, unit) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 2) val = val.slice(0, 2);
    
    let numVal = val === '' ? 0 : parseInt(val, 10);
    const max = unit === 'hours' ? 99 : 59;
    if (numVal > max) numVal = max;
    
    setTime(prev => ({ ...prev, [unit]: numVal }));
  };

  const inputStyle = {
    width: '200px',        // 너비를 충분히 확보
    textAlign: 'center',
    fontSize: '80px',      // 폰트 크기 키움
    fontFamily: "'Orbitron', sans-serif",
    border: 'none',
    background: 'transparent',
    outline: 'none',
    padding: '0',
    color: '#333'
  };
  const colonStyle = {
    fontSize: '80px',
    fontFamily: "'Orbitron', sans-serif",
    paddingBottom: '10px' // 위치 미세 조정
  };
  return (
    <div ref = {containerRef} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
      {['hours', 'minutes', 'seconds'].map((unit, index) => (
        <React.Fragment key={unit}>
          <input 
            data-unit={unit}
            type="text"
            inputMode="numeric"
            style={inputStyle} 
            value={isFocused === unit ? time[unit] : String(time[unit]).padStart(2, '0')} 
            onChange={(e) => handleChange(e, unit)} 
            onFocus={() => setIsFocused(unit)}
            onBlur={() => setIsFocused(null)}
          />
          {index < 2 && <span style={colonStyle}>:</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

export default TimerInput;
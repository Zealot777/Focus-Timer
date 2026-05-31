import React, { useState, useEffect,useRef } from 'react';

function TimerInput({ time, setTime }) {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    const container = containerRef.current;

    const handleWheel = (e) => {
      const unit = e.target.getAttribute('data-unit');
      
      if (!unit) return;
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

    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

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
    width: '200px',        
    textAlign: 'center',
    fontSize: '80px',      
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
    paddingBottom: '10px' 
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
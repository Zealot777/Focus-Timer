//components/Subjectitem.js
import { useState } from 'react';

function SubjectItem({ subject, onDelete, onStart }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [time, setTime] = useState(25);

  return (
    <div className="subject-item">
      <div className="main-row">
        <span>{subject.name}</span>
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? '닫기' : '시간 설정'}
        </button>
        <button onClick={() => onDelete(subject.id)}>삭제</button>
      </div>
      
      {/* 인라인으로 펼쳐지는 설정 영역 */}
      {isExpanded && (
        <div className="setting-area">
          <input type="number" value={time} onChange={(e) => setTime(e.target.value)} />
          <button onClick={() => onStart(subject, time)}>시작하기</button>
        </div>
      )}
    </div>
  );
}
export default SubjectItem;
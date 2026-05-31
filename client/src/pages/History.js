//pages/History.js
import React, { useState, useEffect, useContext } from 'react';
import * as api from '../api';
import { SubjectContext } from '../context/SubjectContext';

function History() {
  const [sessions, setSessions] = useState([]);
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterRange, setFilterRange] = useState('all'); // week, month, all
  const { subjects } = useContext(SubjectContext);
  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 10; 
  // 데이터 로드 함수
  const loadSessions = async () => {
    const subjectId = filterSubject === 'all' ? null : filterSubject;
    const data = await api.getSessionsApi(subjectId);
    setSessions(data);
  };

  useEffect(() => {
    loadSessions();
  }, [filterSubject]);

  // 세션 삭제
  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await fetch(`http://localhost:5000/history/${id}`, { method: 'DELETE' });
      loadSessions(); 
    }
  };

  // 날짜 범위 필터링 로직
  const filteredSessions = sessions.filter(s => {
    const sessionDate = new Date(s.created_at);
    const now = new Date();
    if (filterRange === 'week') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      return sessionDate >= weekAgo;
    }
    if (filterRange === 'month') {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      return sessionDate >= monthAgo;
    }
    return true;
  });
  // 페이지 계산
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSessions = filteredSessions.slice(indexOfFirst, indexOfLast); 
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);

  return (
    <div style={{ padding: '40px' }}>
      <h1>학습 히스토리</h1>
      
      {/* 필터 영역 */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        {/* 과목 필터링 */}
        <select onChange={(e) => setFilterSubject(e.target.value)} value={filterSubject}>
          <option value="all">모든 과목</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        {/* 날짜 필터링 */}
        <select onChange={(e) => setFilterRange(e.target.value)} value={filterRange}>
          <option value="all">전체 기간</option>
          <option value="week">이번 주</option>
          <option value="month">이번 달</option>
        </select>
      </div>

      {/* 목록 테이블 */}
      
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', tableLayout: 'fixed' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #333' }}>
            <th style={{ width: '25%', padding: '10px 0' }}>날짜</th>
            <th style={{ width: '25%', padding: '10px 0' }}>과목</th>
            <th style={{ width: '25%', padding: '10px 0' }}>시간(분)</th>
            <th style={{ width: '25%', padding: '10px 0' }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {filteredSessions.length > 0 ? (
            filteredSessions.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px 0' }}>{s.created_at.split('T')[0]}</td>
                <td style={{ padding: '10px 0' }}>{s.subject_name}</td>
                <td style={{ padding: '10px 0' }}>{Math.floor(s.duration / 60)}분</td>
                <td style={{ padding: '10px 0' }}><button onClick={() => handleDelete(s.id)}>삭제</button></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ padding: '20px', color: '#666' }}>
                기록된 학습 데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* 페이지 이동 버튼 */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>이전</button>
        <span>{currentPage} / {totalPages || 1}</span>
        <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>다음</button>
      </div>
    </div>
  );
}

export default History;
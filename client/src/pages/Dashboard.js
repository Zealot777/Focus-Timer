import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import * as api from '../api';

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.getStatsApi();
      setStats(data);
    };
    fetchData();
  }, []);

  if (!stats) return <div style={{ padding: '40px' }}>로딩 중...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>대시보드</h1>
      
      {/* 요약 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div style={cardStyle}><h3>연속 기록</h3><p style={bigText}>{stats.streak}일</p></div>
        <div style={cardStyle}><h3>총 집중 시간</h3><p style={bigText}>{stats.total_hours}시간</p></div>
        <div style={cardStyle}><h3>이번 주 세션</h3><p style={bigText}>{stats.sessions_this_week}회</p></div>
      </div>

      {/* 차트 영역 */}
      <h3>과목별 집중 시간 (분)</h3>
      <div style={{ height: '300px', minHeight: '300px', width: '100%' , minWidth: '0% ' }}>
        {stats.by_subject.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.by_subject}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="minutes" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        ) : <p>데이터가 없습니다.</p>}
      </div>

      <h3>주간 집중 패턴 (분)</h3>
      <div style={{ height: 300, minHeight:300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.by_weekday}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="minutes" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const cardStyle = { border: '1px solid #ddd', padding: '20px', borderRadius: '8px', textAlign: 'center' };
const bigText = { fontSize: '24px', fontWeight: 'bold', margin: '10px 0' };

export default Dashboard;
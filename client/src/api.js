//api.js
const BASE_URL = 'http://127.0.0.1:5000';

export const fetchSubjects = async () => {
  const res = await fetch(`${BASE_URL}/subjects`);
  return res.json();
};

export const deleteSubjectApi = async (id) => {
  const res = await fetch(`${BASE_URL}/subjects/${id}`, { method: 'DELETE' });
  return res.json();
};

export const addSubjectApi = async (name) => {
  const res = await fetch(`${BASE_URL}/subjects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  return res.json();
};
export const saveSessionApi = async (subjectId, subjectName, duration) => {
  const res = await fetch(`${BASE_URL}/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject_id: subjectId, subject_name: subjectName, duration: duration })
  });
  return res.json();
};

// 데이터 조회 (GET /history)
export const getSessionsApi = async (subjectId = null) => {
  const url = subjectId ? `${BASE_URL}/history?subject_id=${subjectId}` : `${BASE_URL}/history`;
  const res = await fetch(url);
  return res.json();
};
// 데이터 조회(GET /stats)
export const getStatsApi = async () => {
  const res = await fetch(`${BASE_URL}/stats`);
  return res.json();
};
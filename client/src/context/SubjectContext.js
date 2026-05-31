// src/context/SubjectContext.js
import { createContext, useState, useEffect } from 'react';

export const SubjectContext = createContext();

export const SubjectProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([]);
  
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/subjects`)
      .then(res => res.json())
      .then(data => setSubjects(data));
  }, []);

  return (
    <SubjectContext.Provider value={{ subjects, setSubjects }}>
      {children}
    </SubjectContext.Provider>
  );
};
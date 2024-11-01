// context/SubmissionsContext.js
import React, { createContext, useState } from "react";

export const SubmissionsContext = createContext();

export const SubmissionsProvider = ({ children }) => {
  const [submissions, setSubmissions] = useState([]);

  const addSubmission = (submission) => {
    setSubmissions((prev) => [...prev, submission]);
  };

  return (
    <SubmissionsContext.Provider value={{ submissions, addSubmission }}>
      {children}
    </SubmissionsContext.Provider>
  );
};

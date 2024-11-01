import React from "react";
import { useNavigate } from "react-router-dom";

export default function WarningPage() {
  const navigate = useNavigate();
  
  return (
    <div className="warning-page">
      <h2>Warning</h2>
      <p>Please stay on the quiz page to complete the quiz.</p>
      <button onClick={() => navigate("/quizcard")}>Return to Quiz</button>
    </div>
  );
}

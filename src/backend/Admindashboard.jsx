import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  // Load submissions from local storage
  const loadSubmissions = () => {
    const savedSubmissions = JSON.parse(localStorage.getItem("submissions") || "[]");
    setSubmissions(savedSubmissions);
  };

  useEffect(() => {
    loadSubmissions();
    // Mock user authentication
    setUserEmail(localStorage.getItem("userEmail") || "testuser@example.com");
  }, []);

  const deleteSubmission = (id) => {
    const updatedSubmissions = submissions.filter((submission) => submission._id !== id);
    setSubmissions(updatedSubmissions);
    localStorage.setItem("submissions", JSON.stringify(updatedSubmissions));
  };

  const formatAnswers = (userAnswers = {}, correctAnswers = {}) => {
    return Object.entries(userAnswers).map(([question, answer]) => ({
      question,
      answer,
      isCorrect: correctAnswers[question] === answer ? "Correct" : "Incorrect",
    }));
  };

  const exportToXLSX = () => {
    let worksheetData = [];
    submissions.forEach((submission) => {
      const correctAnswers = submission.correctAnswers || {};
      const answerResults = formatAnswers(submission.userAnswers, correctAnswers);
      const score = answerResults.filter((a) => a.isCorrect === "Correct").length;

      worksheetData.push({
        ID: submission._id,
        UserID: userEmail,
        Timestamp: submission.timestamp
          ? new Date(submission.timestamp).toLocaleString()
          : "N/A",
        Score: score,
        Answers: "",
      });

      answerResults.forEach((answer) => {
        worksheetData.push({
          ID: "",
          UserID: "",
          Timestamp: "",
          Score: "",
          Answers: `${answer.question}: ${answer.answer} (${answer.isCorrect})`,
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");
    XLSX.writeFile(workbook, "submissions.xlsx");
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>UserID</th>
            <th>Timestamp</th>
            <th>Score</th>
            <th>Export</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => {
            const answerResults = formatAnswers(
              submission.userAnswers || {},
              submission.correctAnswers || {}
            );
            const score = answerResults.filter((a) => a.isCorrect === "Correct").length;

            return (
              <tr key={submission._id}>
                <td>{submission._id}</td>
                <td>{userEmail}</td>
                <td>{new Date(submission.timestamp).toLocaleString()}</td>
                <td>{score}</td>
                <td>
                  <button onClick={exportToXLSX} disabled={submissions.length === 0}>
                    Export to XLSX
                  </button>
                </td>
                <td>
                  <button onClick={() => deleteSubmission(submission._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

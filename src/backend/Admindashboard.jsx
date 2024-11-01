// src/components/AdminDashboard.js
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../hooks/firebaseConfig";

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("https://quiz-cloud-6ex5.vercel.app/api/submissions");
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail("");
      }
    });
    return () => unsubscribe();
  }, []);

  const deleteSubmission = async (id) => {
    try {
      await fetch(`https://quiz-cloud-6ex5.vercel.app/api/submissions/${id}`, {
        method: "DELETE",
      });
      // Refresh the list after deletion
      setSubmissions(submissions.filter((submission) => submission._id !== id));
    } catch (error) {
      console.error("Error deleting submission:", error);
    }
  };

  const formatAnswers = (userAnswers = {}, correctAnswers = {}) => {
    if (!userAnswers || typeof userAnswers !== "object") return [];
    return Object.entries(userAnswers).map(([question, answer]) => ({
      question,
      answer,
      isCorrect: correctAnswers[question] === answer ? "Correct" : "Incorrect",
    }));
  };

  const exportToXLSX = () => {
    let worksheetData = [];
    submissions.forEach((submission) => {
      const correctAnswers = submission.correctAnswers || {}; // Ensure this is defined

      const answerResults = formatAnswers(
        submission.userAnswers,
        correctAnswers // Pass the correct answers for comparison
      );

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
            const score = answerResults.filter(
              (a) => a.isCorrect === "Correct"
            ).length;

            return (
              <tr key={submission._id}>
                <td>{submission._id}</td>
                <td>{userEmail}</td>
                <td>{new Date(submission.timestamp).toLocaleString()}</td>
                <td>{score}</td>
                <td>
                  <button
                    onClick={exportToXLSX}
                    disabled={submissions.length === 0}
                  >
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

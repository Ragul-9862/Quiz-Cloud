import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../hooks/firebaseConfig";
import { signOut } from "firebase/auth";
import { questions } from "../utils/question";

export default function QuizCard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timer, setTimer] = useState(1200);
  const [user, setUser] = useState(null);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const questionsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));

      const storedShuffledQuestions = localStorage.getItem("shuffledQuestions");
      if (!storedShuffledQuestions) {
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        setShuffledQuestions(shuffled);
        localStorage.setItem("shuffledQuestions", JSON.stringify(shuffled));
      } else {
        setShuffledQuestions(JSON.parse(storedShuffledQuestions));
      }

      const savedAnswers = localStorage.getItem("userAnswers");
      if (savedAnswers) {
        setUserAnswers(JSON.parse(savedAnswers));
      }
    }
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const startIndex = (currentPage - 1) * questionsPerPage;
  const currentQuestions = shuffledQuestions.slice(
    startIndex,
    startIndex + questionsPerPage
  );

  const handleAnswerChange = (questionIndex, answer) => {
    const updatedAnswers = { ...userAnswers, [questionIndex]: answer };
    setUserAnswers(updatedAnswers);
    localStorage.setItem("userAnswers", JSON.stringify(updatedAnswers));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const submissionData = {
      _id: Date.now().toString(),
      userAnswers,
      timestamp: new Date(),
    };

    const savedSubmissions = JSON.parse(localStorage.getItem("submissions") || "[]");
    savedSubmissions.push(submissionData);
    localStorage.setItem("submissions", JSON.stringify(savedSubmissions));

    console.log("Submission saved to local storage:", submissionData);
    navigate("/success");
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const allQuestionsAnswered = () => {
    return currentQuestions.every(
      (_, index) => userAnswers[startIndex + index] !== undefined
    );
  };

  return (
    <section className="quiz-section container-fluid">
      <div className="quiz-card" style={{ userSelect: "none" }}>
        <header className="quiz-header">
          <h2>Quiz</h2>
          {user && (
            <div className="user-info">
              <span>{user.email}</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </header>
        <div className="quiz-timer">
          <span>{formatTime(timer)}</span>
        </div>
        <div>
          {currentQuestions.map((q, index) => (
            <div key={startIndex + index} className="question-container">
              <p className="question-text">{q.question}</p>
              {q.options.map((option, optionIndex) => (
                <label key={optionIndex} className="option-label">
                  <input
                    type="radio"
                    name={`question-${startIndex + index}`}
                    value={option}
                    checked={userAnswers[startIndex + index] === option}
                    onChange={() =>
                      handleAnswerChange(startIndex + index, option)
                    }
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
        </div>
        <div className="navigation-container">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
            Previous
          </button>
          <button
            disabled={
              currentPage === Math.ceil(shuffledQuestions.length / questionsPerPage)
            }
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
        <div className="export-container">
          <p>
            Page {currentPage} of{" "}
            {Math.ceil(shuffledQuestions.length / questionsPerPage)}
          </p>
          {currentPage === Math.ceil(shuffledQuestions.length / questionsPerPage) &&
          allQuestionsAnswered() &&
          !isSubmitted ? (
            <button className="export-answer" onClick={handleSubmit}>
              Submit
            </button>
          ) : (
            <p>Please answer all questions to proceed.</p>
          )}
        </div>
        {isSubmitted && <p>Submission Successful! Redirecting...</p>}
      </div>
    </section>
  );
}

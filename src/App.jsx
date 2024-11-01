import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import QuizCard from "./components/Quizcard";
import Scoreboard from "./components/Scoreboard";
import WarningPage from "./components/WarningPage";
import AdminDashboard from "./backend/Admindashboard";
import { SubmissionsProvider } from "./context/SubmissionsContext";
function App() {
  return (
    <>
      <BrowserRouter>
        <SubmissionsProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/quizcard" element={<QuizCard />} />
            <Route path="/success" element={<Scoreboard />} />
            <Route path="/warning" element={<WarningPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </SubmissionsProvider>
      </BrowserRouter>
    </>
  );
}

export default App;

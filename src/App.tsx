import {
  BrowserRouter as Router,
  Routes,
  Route,
  useRoutes,
} from "react-router-dom";
import routes from "tempo-routes";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Messages from "./pages/Messages";
import Trainers from "./pages/Trainers";
import TrainingRequests from "./pages/TrainingRequests";

function App() {
  return (
    <Router>
      {/* For the tempo routes */}
      {import.meta.env.VITE_TEMPO && useRoutes(routes)}

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/trainers" element={<Trainers />} />
        <Route path="/training-requests" element={<TrainingRequests />} />

        {/* Add this before any catchall route */}
        {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}

        {/* Catchall route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;

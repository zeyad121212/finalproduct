import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import routes from "tempo-routes";

// Layouts
import DashboardLayout from "./components/layout/DashboardLayout";

// Pages
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Calendar = lazy(() => import("./pages/Calendar"));
const TrainingRequests = lazy(() => import("./pages/TrainingRequests"));
const Messages = lazy(() => import("./pages/Messages"));
const Trainers = lazy(() => import("./pages/Trainers"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="training-requests" element={<TrainingRequests />} />
            <Route path="messages" element={<Messages />} />
            <Route path="trainers" element={<Trainers />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />

          {/* Tempo routes for storyboards */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>

        {/* Tempo routes for storyboards */}
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;

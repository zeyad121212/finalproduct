import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <p>Redirecting to dashboard...</p>
    </div>
  );
}

export default Home;

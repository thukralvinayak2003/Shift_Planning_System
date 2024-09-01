import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import { useAuthContext } from "./context/AuthContext.jsx";
import ViewShift from "./pages/home/employee/ViewShift";
import Employee from "./pages/home/employee/Employee"; // Import your Employee component
import Admin from "./pages/home/admin/Admin"; // Import your Admin component

function App() {
  const { user } = useAuthContext();

  const renderHome = () => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    return user.data.user.role === "Admin" ? <Admin /> : <Employee />;
  };

  return (
    <>
      <Routes>
        <Route path="/" element={renderHome()} />
        <Route
          path="/shifts"
          element={user ? <ViewShift /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <Signup />}
        />
      </Routes>
    </>
  );
}

export default App;

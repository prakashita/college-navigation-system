import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import UserDashboard from './pages/UserDashboard'; // adjust path if different
import AdminDashboard from './pages/AdminDashboard'; // adjust path if different
// import ProtectedAdminRoute from './components/Common/ProtectedAdminRoute';


function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route  path="/admin"  element=
          {    
                  <AdminDashboard />
              
          }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home'
import Dashboard from './Components/Dashboard';
import Login from './Components/User/Login';
import Register from './Components/User/Register';
import ForgotPassword from './Components/User/ForgotPassword';
import ProtectedRoute from './Components/Route/ProtectedRoute';
import ClassDetails from './Components/Class/ClassDetails';
import ClassworkDetails from './Components/Classworks/ClassworkDetails';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} exact />
          <Route path="/class/:id" element={<ProtectedRoute><ClassDetails /></ProtectedRoute>} exact />
          <Route path="/login" element={<Login />} exact />
          <Route path="/register" element={<Register />} exact />
          <Route path="/password/forgot" element={<ForgotPassword />} exact />
          <Route path="/class/classwork/:id" element={<ProtectedRoute><ClassworkDetails /></ProtectedRoute>} exact />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

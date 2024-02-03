import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Login from './Components/User/Login';
import Register from './Components/User/Register';
import ForgotPassword from './Components/User/ForgotPassword';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} exact />
          <Route path="/login" element={<Login />} exact />
          <Route path="/register" element={<Register />} exact />
          <Route path="/password/forgot" element={<ForgotPassword />} exact />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

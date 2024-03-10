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
import Modules from './Components/Module/Modules';
import ClassroomList from './Components/Admin/Classroom/ClassroomList';
import UserList from './Components/Admin/User/UsersList';
import ModuleList from './Components/Admin/Module/ModuleList';
import AnalyticsBoard from './Components/Admin/Analytics/AnalyticsBoard';
import Verification from './Components/User/Verification';
import ArchivedModules from './Components/Admin/Module/ArchivedModules';
import ArchivedClass from './Components/Class/ArchivedClass';
import ArchivedClassDetails from './Components/Class/ArchivedClassDetails';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} exact />
          <Route path="/archive/classrooms" element={<ProtectedRoute><ArchivedClass /></ProtectedRoute>} exact />
          <Route path="/class/:id" element={<ProtectedRoute><ClassDetails /></ProtectedRoute>} exact />
          <Route path="/class/detail/archive/:id" element={<ProtectedRoute><ArchivedClassDetails /></ProtectedRoute>} exact />
          <Route path="/login" element={<Login />} exact />
          <Route path="/register" element={<Register />} exact />
          <Route path="/verification" element={<Verification />} exact />
          <Route path="/password/forgot" element={<ForgotPassword />} exact />
          <Route path="/class/classwork/:id" element={<ProtectedRoute><ClassworkDetails /></ProtectedRoute>} exact />

          <Route path="/modules" element={<ProtectedRoute><Modules /></ProtectedRoute>} exact />
          <Route path="/admin/classrooms" element={<ProtectedRoute><ClassroomList /></ProtectedRoute>} exact />
          <Route path="/admin/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} exact />
          <Route path="/admin/modules" element={<ProtectedRoute><ModuleList /></ProtectedRoute>} exact />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AnalyticsBoard /></ProtectedRoute>} exact />
          <Route path="/admin/archive/modules" element={<ProtectedRoute><ArchivedModules /></ProtectedRoute>} exact />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

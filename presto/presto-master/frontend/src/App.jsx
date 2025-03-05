import {Route, Routes} from 'react-router-dom';
import HomeScreen from './pages/home/HomeScreen';
import LoginScreen from './pages/auth/loginScreen';
import RegisterScreen from './pages/auth/registerScreen';
import Slide from './pages/slide/SlidePage';
import { ProtectedRoute } from './helper/protectedRoute';
import DashboardScreen from './pages/Dashboard/DashboardScreen';
import SlideDashboard from './pages/Dashboard/SlideDashboard';
import axios from 'axios';
import PreviewPage from './pages/perview/PreviewPage';
import Page from './page';
import NotFound from './not-found';



const key = import.meta.env.VITE_API;
axios.defaults.baseURL = key;

function App() { 
  return (
    <Routes>
      <Route path='/' exact element={<HomeScreen/>}/>
      <Route path='/page' exact element={<Page/>}/>
      <Route path='/login'  element={<LoginScreen/>}/>
      <Route path='/register'  element={<RegisterScreen/>}/>
      <Route path='/dashboard'  element={<ProtectedRoute><DashboardScreen/></ProtectedRoute>}/>
      <Route path='/dashboard/:id'  element={<ProtectedRoute><SlideDashboard/></ProtectedRoute>}/>
      <Route path='/dashboard/:id/:index'  element={<ProtectedRoute><Slide/></ProtectedRoute>}/>
      <Route path='/preview/:id/:index'  element={<ProtectedRoute><PreviewPage/></ProtectedRoute>}/>
      <Route path='/*'  element={<NotFound/>}/>
    </Routes>
  )
}

export default App

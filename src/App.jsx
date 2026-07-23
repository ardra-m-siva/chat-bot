import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import MainLayout from './layout/MainLayout'
import ProtectRoute from './authentication/ProtectRoute'

function App() {

  return (
    <Routes>
      <Route path='/register' element={<LoginPage registerUser />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/' element={<ProtectRoute><MainLayout /></ProtectRoute>} />
    </Routes>
  )
}

export default App

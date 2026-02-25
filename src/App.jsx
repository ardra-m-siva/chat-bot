import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Navigate to={'/login'} replace />} />
      <Route path='/register' element={<LoginPage register />} />
      <Route path='/login' element={<LoginPage />} />
    </Routes>
  )
}

export default App

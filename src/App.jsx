import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import MainLayout from './layout/MainLayout'

function App() {

  return (
    <Routes>
      <Route path='/' element={<MainLayout/>} />
      <Route path='/register' element={<LoginPage register />} />
      <Route path='/login' element={<LoginPage />} />
    </Routes>
  )
}

export default App

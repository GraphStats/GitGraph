import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { UserDetail } from './pages/UserDetail'
import { RepoDetail } from './pages/RepoDetail'
import { Terms } from './pages/Terms'
import { Privacy } from './pages/Privacy'
import './App.css'

function App() {
  return (
    <Router>
      <div className="layout-root">
        <Navbar />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/u/:username" element={<UserDetail />} />
            <Route path="/r/:username/:reponame" element={<RepoDetail />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="footer-content">
            <p>&copy; {new Date().getFullYear()} GitGraph. All rights reserved.</p>
            <div className="footer-links">
              <a href="/terms">Terms</a>
              <a href="/privacy">Privacy</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App

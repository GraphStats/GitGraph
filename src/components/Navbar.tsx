import { Github, Sun, Moon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Navbar.css'

export const Navbar = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light')
    }

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link to="/" className="navbar-logo">
                    <Github size={28} color="var(--primary)" />
                    <span className="logo-text">GitGraph</span>
                </Link>
                <div className="navbar-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle"
                        aria-label="Toggle Theme"
                        title="Toggle Dark/Light Mode"
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                </div>
            </div>
        </nav>
    )
}

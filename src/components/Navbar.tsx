import { Github } from 'lucide-react'
import { Link } from 'react-router-dom'
import './Navbar.css'

export const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link to="/" className="navbar-logo">
                    <Github size={28} color="var(--primary)" />
                    <span className="logo-text">GitGraph</span>
                </Link>
                <div className="navbar-links">
                    <Link to="/" className="nav-link">Home</Link>
                </div>
            </div>
        </nav>
    )
}

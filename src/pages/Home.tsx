import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Github } from 'lucide-react'
import { motion } from 'framer-motion'

type SearchMode = 'user' | 'repo';

export const Home = () => {
    const [query, setQuery] = useState('')
    const [mode, setMode] = useState<SearchMode>('user')
    const navigate = useNavigate()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        if (mode === 'user') {
            navigate(`/u/${query.trim()}`)
        } else {
            const parts = query.split('/')
            if (parts.length < 2 || !parts[0] || !parts[1]) {
                alert('Please use owner/repo format for repository search (e.g. facebook/react)')
                return
            }
            navigate(`/r/${parts[0].trim()}/${parts[1].trim()}`)
        }
    }

    return (
        <motion.div
            className="search-section"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="logo-container">
                <Github size={80} color="var(--primary)" style={{ filter: 'drop-shadow(0 0 20px var(--primary-glow))' }} />
                <h1>GitGraph</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '0.5rem', fontWeight: 500 }}>
                    Visualize GitHub profiles and repositories with premium analytics.
                </p>
            </div>

            <div className="search-mode-switcher">
                <button
                    type="button"
                    className={`mode-button ${mode === 'user' ? 'active' : ''}`}
                    onClick={() => setMode('user')}
                >
                    User
                </button>
                <button
                    type="button"
                    className={`mode-button ${mode === 'repo' ? 'active' : ''}`}
                    onClick={() => setMode('repo')}
                >
                    Repository
                </button>
            </div>

            <form onSubmit={handleSearch} className="search-box glass">
                <Search color="var(--text-muted)" size={24} style={{ marginLeft: '1.5rem' }} />
                <input
                    type="text"
                    className="search-input"
                    placeholder={mode === 'user' ? "Enter GitHub username..." : "Enter owner/repository..."}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                />
                <button type="submit" className="search-button">
                    Search
                </button>
            </form>

            <div style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', width: '100%', maxWidth: '900px', margin: '5rem auto 0' }}>
                <div className="feature-item">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Real-time Data</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Direct integration with the official GitHub API.</p>
                </div>
                <div className="feature-item">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Interactive Charts</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Beautifully rendered commit and language statistics.</p>
                </div>
                <div className="feature-item">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Deep Insights</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Analyze repository growth and star history.</p>
                </div>
            </div>
        </motion.div>
    )
}

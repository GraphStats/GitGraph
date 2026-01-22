import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, GitFork, Box, Loader2, ArrowLeft, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { githubService, type RepoStats } from '../services/github'
import { StatCard } from '../components/StatCard'
import { CommitChart, RepoLanguageChart } from '../components/Charts'

export const RepoDetail = () => {
    const { username, reponame } = useParams<{ username: string; reponame: string }>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [repoData, setRepoData] = useState<RepoStats | null>(null)
    const [commitActivity, setCommitActivity] = useState<any[]>([])
    const [repoLanguages, setRepoLanguages] = useState<Record<string, number>>({})

    useEffect(() => {
        const fetchData = async () => {
            if (!username || !reponame) return
            setLoading(true)
            setError(null)
            try {
                const [repo, activity] = await Promise.all([
                    githubService.getRepo(username, reponame),
                    githubService.getCommitActivity(username, reponame)
                ])

                const languages = await githubService.getRepoLanguages(repo.languages_url)

                setRepoData(repo)
                setCommitActivity(activity)
                setRepoLanguages(languages)
            } catch (err: any) {
                setError(err.message || 'Could not find repository. Check the name and try again.')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [username, reponame])

    if (loading) {
        return (
            <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary)" />
                <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Fetching repository data...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
                <p style={{ color: '#ef4444', fontSize: '1.2rem', fontWeight: 600 }}>{error}</p>
                <Link to="/" className="search-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    <ArrowLeft size={20} /> Back to Search
                </Link>
            </div>
        )
    }

    return (
        <div className="app-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <Link to={username ? `/u/${username}` : "/"} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }} className="hover-primary">
                    <ArrowLeft size={18} /> Back to {username}'s Profile
                </Link>
                {repoData && (
                    <a href={repoData.html_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                        View on GitHub <ExternalLink size={16} />
                    </a>
                )}
            </div>

            <AnimatePresence mode="wait">
                {repoData && (
                    <motion.div
                        key={repoData.full_name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div style={{ marginBottom: '3rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <Box size={32} color="var(--primary)" />
                                <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{repoData.name}</h1>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '800px' }}>
                                {repoData.description || 'No description provided.'}
                            </p>
                        </div>

                        <div className="metrics-row" style={{ marginBottom: '3rem' }}>
                            <StatCard
                                label="Stars"
                                value={repoData.stargazers_count}
                                icon={Star}
                                color="#f59e0b"
                            />
                            <StatCard
                                label="Forks"
                                value={repoData.forks_count}
                                icon={GitFork}
                                color="#10b981"
                            />
                            <StatCard
                                label="Main Language"
                                value={repoData.language || 'None'}
                                icon={Box}
                                color="#6366f1"
                            />
                        </div>

                        <div className="chart-section">
                            <CommitChart activity={commitActivity} />
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                                <RepoLanguageChart languages={repoLanguages} />
                                <div className="chart-card">
                                    <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Repository Info</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>Created at</span>
                                            <span style={{ fontWeight: 600 }}>{new Date(repoData.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>Last updated</span>
                                            <span style={{ fontWeight: 600 }}>{new Date(repoData.updated_at).toLocaleDateString()}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>License</span>
                                            <span style={{ fontWeight: 600 }}>{repoData.license?.name || 'MIT License'}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>Size</span>
                                            <span style={{ fontWeight: 600 }}>{(repoData.size / 1024).toFixed(2)} MB</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

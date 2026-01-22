import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { User, Star, Box, Loader2, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { githubService, type UserStats, type RepoStats } from '../services/github'
import { StatCard } from '../components/StatCard'
import { ProfileHeader } from '../components/ProfileHeader'
import { LanguageChart, StarsChart, CommitChart } from '../components/Charts'

export const UserDetail = () => {
    const { username } = useParams<{ username: string }>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [userData, setUserData] = useState<UserStats | null>(null)
    const [repos, setRepos] = useState<RepoStats[]>([])
    const [commitActivity, setCommitActivity] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            if (!username) return
            setLoading(true)
            setError(null)
            try {
                const [user, userRepos] = await Promise.all([
                    githubService.getUser(username),
                    githubService.getRepos(username)
                ])
                setUserData(user)
                setRepos(userRepos)

                // Aggregate activity from top repos
                const activity = await githubService.getUserCommitActivity(user.login, userRepos)
                setCommitActivity(activity)
            } catch (err: any) {
                setError(err.message || 'Could not find user. Check the name and try again.')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [username])

    if (loading) {
        return (
            <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary)" />
                <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Fetching GitHub data...</p>
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
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '2rem', fontWeight: 500 }} className="hover-primary">
                <ArrowLeft size={18} /> Back to Search
            </Link>

            <AnimatePresence mode="wait">
                {userData && (
                    <motion.div
                        key={userData.login}
                        className="dashboard-grid"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <aside className="sidebar-section">
                            <ProfileHeader user={userData} />
                        </aside>

                        <main className="main-content-section">
                            <div className="metrics-row">
                                <StatCard
                                    label="Public Repos"
                                    value={userData.public_repos}
                                    icon={Box}
                                    color="#0066ff"
                                />
                                <StatCard
                                    label="Followers"
                                    value={userData.followers}
                                    icon={User}
                                    color="#8b5cf6"
                                />
                                <StatCard
                                    label="Total Stars"
                                    value={repos.reduce((acc: number, r: RepoStats) => acc + r.stargazers_count, 0)}
                                    icon={Star}
                                    color="#f59e0b"
                                />
                            </div>

                            <div className="chart-section">
                                <CommitChart activity={commitActivity} />
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                                    <LanguageChart repos={repos} />
                                    <StarsChart repos={repos} />
                                </div>
                            </div>

                            <section>
                                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>
                                    Recent Repositories
                                </h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                    {repos.slice(0, 6).map((repo: RepoStats) => (
                                        <Link
                                            key={repo.id}
                                            to={`/r/${userData.login}/${repo.name}`}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <div className="repo-card stat-card" style={{ height: '100%' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)' }}>{repo.name}</h4>
                                                    <span className="badge">{repo.language || 'Plain'}</span>
                                                </div>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', flex: 1 }}>{repo.description}</p>
                                                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <Star size={14} /> {repo.stargazers_count}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <Box size={14} /> {repo.forks_count}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        </main>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, AreaChart, Area, Brush } from 'recharts';
import { type RepoStats } from '../services/github';
import { useState } from 'react';
import { BarChart2, TrendingUp, AlertCircle, Clock } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const CustomTooltipStyle = {
    borderRadius: '12px',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow)',
    background: 'var(--surface)',
    color: 'var(--text-main)'
};

export const LanguageChart = ({ repos }: { repos: RepoStats[] }) => {
    const langData = repos.reduce((acc: Record<string, number>, repo) => {
        if (repo.language) {
            acc[repo.language] = (acc[repo.language] || 0) + 1;
        }
        return acc;
    }, {});

    const data = Object.entries(langData)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

    return (
        <div className="chart-card">
            <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Top Languages</h3>
            <div style={{ height: '300px', minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={CustomTooltipStyle}
                            formatter={(value: number) => {
                                const total = data.reduce((acc, item) => acc + item.value, 0);
                                const percent = ((value / total) * 100).toFixed(1);
                                return [`${value} repos (${percent}%)`];
                            }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export const StarsChart = ({ repos }: { repos: RepoStats[] }) => {
    const data = [...repos]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5)
        .map(repo => ({
            name: repo.name.length > 12 ? repo.name.substring(0, 10) + '...' : repo.name,
            stars: repo.stargazers_count
        }));

    return (
        <div className="chart-card">
            <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Top Repositories by Stars</h3>
            <div style={{ height: '300px', minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 10 }} />
                        <YAxis stroke="var(--text-muted)" tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={CustomTooltipStyle} />
                        <Bar dataKey="stars" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export const CommitChart = ({ activity }: { activity: any[] }) => {
    const [style, setStyle] = useState<'bar' | 'line'>('bar');

    const safeActivity = activity || [];

    const fullYearData = safeActivity.map(week => ({
        week: new Date(week.week * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        commits: week.total,
        timestamp: week.week
    }));

    const hasEverHadCommits = fullYearData.some(d => d.commits > 0);

    if (safeActivity.length === 0) {
        return (
            <div className="chart-card" style={{ gridColumn: 'span 12', height: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <Clock size={48} color="var(--primary)" className="animate-spin-slow" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Calcul en cours sur GitHub...</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '450px', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    GitHub génère les statistiques du dépôt en ce moment même. <br />
                    <strong>Attendez 5 secondes</strong>.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    style={{ marginTop: '1.5rem', background: 'var(--primary)', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 600 }}
                >
                    Rafraîchir les stats
                </button>
            </div>
        );
    }

    if (!hasEverHadCommits) {
        return (
            <div className="chart-card" style={{ gridColumn: 'span 12', height: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <AlertCircle size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Aucun commit cette année</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '400px', fontSize: '0.95rem' }}>
                    GitHub n'a enregistré aucun commit sur ce dépôt au cours des 52 dernières semaines.
                </p>
            </div>
        );
    }

    return (
        <div className="chart-card" style={{ gridColumn: 'span 12', height: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h3 style={{ fontWeight: 700 }}>Activité des Commits</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mises à jour hebdomadaires</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--background)', padding: '0.25rem', borderRadius: '8px' }}>
                    <button
                        onClick={() => setStyle('bar')}
                        style={{
                            padding: '0.4rem',
                            borderRadius: '6px',
                            background: style === 'bar' ? 'var(--surface)' : 'transparent',
                            color: style === 'bar' ? 'var(--primary)' : 'var(--text-muted)',
                            boxShadow: style === 'bar' ? 'var(--shadow)' : 'none'
                        }}
                    >
                        <BarChart2 size={18} />
                    </button>
                    <button
                        onClick={() => setStyle('line')}
                        style={{
                            padding: '0.4rem',
                            borderRadius: '6px',
                            background: style === 'line' ? 'var(--surface)' : 'transparent',
                            color: style === 'line' ? 'var(--primary)' : 'var(--text-muted)',
                            boxShadow: style === 'line' ? 'var(--shadow)' : 'none'
                        }}
                    >
                        <TrendingUp size={18} />
                    </button>
                </div>
            </div>

            <div style={{ height: '350px', minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    {style === 'bar' ? (
                        <BarChart data={fullYearData}>
                            <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} stroke="var(--border)" interval={4} />
                            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} stroke="var(--border)" />
                            <Tooltip contentStyle={CustomTooltipStyle} />
                            <Bar dataKey="commits" fill="var(--primary)" radius={[2, 2, 0, 0]} />
                            <Brush
                                dataKey="week"
                                height={30}
                                stroke="var(--primary)"
                                fill="var(--background)"
                                startIndex={fullYearData.length - 26}
                            />
                        </BarChart>
                    ) : (
                        <AreaChart data={fullYearData}>
                            <defs>
                                <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} stroke="var(--border)" interval={4} />
                            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} stroke="var(--border)" />
                            <Tooltip contentStyle={CustomTooltipStyle} />
                            <Area
                                type="monotone"
                                dataKey="commits"
                                stroke="#10b981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorCommits)"
                            />
                            <Brush
                                dataKey="week"
                                height={30}
                                stroke="#10b981"
                                fill="var(--background)"
                                startIndex={fullYearData.length - 26}
                            />
                        </AreaChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export const RepoLanguageChart = ({ languages }: { languages: Record<string, number> }) => {
    const data = Object.entries(languages)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

    return (
        <div className="chart-card">
            <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Répartition des Langages</h3>
            <div style={{ height: '300px', minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={CustomTooltipStyle}
                            formatter={(value: number) => {
                                const total = data.reduce((acc, item) => acc + item.value, 0);
                                const percent = ((value / total) * 100).toFixed(1);
                                const formattedValue = value > 1024 * 1024
                                    ? `${(value / (1024 * 1024)).toFixed(2)} MB`
                                    : `${(value / 1024).toFixed(2)} KB`;
                                return [formattedValue, `Share: ${percent}%`];
                            }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

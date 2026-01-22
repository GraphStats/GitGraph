import { MapPin, Link as LinkIcon, Calendar } from 'lucide-react';
import { type UserStats } from '../services/github';

export const ProfileHeader = ({ user }: { user: UserStats }) => {
    return (
        <div className="stat-card profile-card">
            <img src={user.avatar_url} alt={user.login} className="avatar" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user.name || user.login}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>@{user.login}</p>

            {user.bio && <p style={{ marginBottom: '1.5rem', lineHeight: 1.5 }}>{user.bio}</p>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {user.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={16} /> {user.location}
                    </div>
                )}
                {user.blog && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <LinkIcon size={16} /> <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{user.blog}</a>
                    </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} /> Joined {new Date(user.created_at).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

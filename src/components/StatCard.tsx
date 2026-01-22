import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color?: string;
}

export const StatCard = ({ label, value, icon: Icon, color = 'var(--primary)' }: StatCardProps) => {
    return (
        <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                <div style={{ flex: 1 }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 500 }}>{label}</p>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{typeof value === 'number' ? value.toLocaleString() : value}</h2>
                </div>
                <div style={{
                    background: `${color}10`,
                    padding: '0.6rem',
                    borderRadius: '10px',
                    color: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Icon size={20} />
                </div>
            </div>
        </div>
    );
};

import { motion } from 'framer-motion'
import { ShieldAlert } from 'lucide-react'

export const Privacy = () => {
    return (
        <motion.div
            className="page-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="content-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(54, 92, 245, 0.1)', borderRadius: '12px' }}>
                        <ShieldAlert color="var(--primary)" size={32} />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Conditions d'utilisation</h1>
                </div>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>1. Collecte des données</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        GitGraph n'enregistre aucune donnée personnelle sur ses serveurs. Toutes les données affichées
                        proviennent directement de l'API publique de GitHub et sont traitées côté client.
                        GitGraph enregistre uniquement : votre IP (Internet Protocol), le type de votre navigateur, le système d'exploitation que vous utilisez, et les pages que vous visitez.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>2. Utilisation des Cookies</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        Nous n'utilisons aucun cookie de suivi tiers. Seules les préférences locales de l'application
                        peuvent être stockées dans votre navigateur via le LocalStorage.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>3. API GitHub</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        L'utilisation de ce service est soumise aux limites de taux de l'API GitHub. Si vous atteignez
                        ces limites, certaines fonctionnalités pourraient être temporairement indisponibles.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>4. Contact</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        Pour toute question concernant ces conditions, vous pouvez nous contacter via notre dépôt GitHub officiel.
                    </p>
                </section>
            </div>
        </motion.div>
    )
}

import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'

export const Terms = () => {
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
                        <FileText color="var(--primary)" size={32} />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Terms of Service</h1>
                </div>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>1. Acceptance of Terms</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        By accessing and using GitGraph, you agree to comply with and be bound by these Terms of Service.
                        If you do not agree to these terms, please do not use our services.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>2. Description of Service</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        GitGraph provides visual statistics for GitHub users and repositories. We use the public GitHub API
                        to fetch and display data. We are not affiliated with GitHub Inc.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>3. Usage Limitations</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        Users must not use this service in any way that causes, or may cause, damage to the service or
                        impairment of the availability or accessibility of GitGraph.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>4. Changes to Terms</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        We reserve the right to modify these terms at any time. Your continued use of the service
                        following any changes constitutes acceptance of the new Terms.
                    </p>
                </section>
            </div>
        </motion.div>
    )
}

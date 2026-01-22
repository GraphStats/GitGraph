import fetch from 'node-fetch';

export default async function handler(req, res) {
    // On récupère le reste de l'URL après /api/github/
    // Exemple: /api/github/users/facebook -> githubPath = /users/facebook
    const urlObj = new URL(req.url, 'http://localhost');
    const githubPath = urlObj.pathname.replace('/api/github', '');
    const query = urlObj.search;

    const url = `https://api.github.com${githubPath}${query}`;
    const GITHUB_TOKEN = process.env.VITE_GITHUB_TOKEN || process.env.GITHUB_TOKEN;

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : '',
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'GitGraph-Proxy-Vercel'
            }
        });

        // Copier les headers importants (Rate Limits)
        const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
        if (rateLimitRemaining) res.setHeader('x-ratelimit-remaining', rateLimitRemaining);

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        console.error('Vercel Proxy Error:', error);
        return res.status(500).json({ message: 'Error fetching from GitHub' });
    }
}

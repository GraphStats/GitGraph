import fetch from 'node-fetch';

export default async function handler(req, res) {
    // Nettoyage de l'URL pour la redirection vers GitHub
    const urlObj = new URL(req.url, 'http://localhost');
    let githubPath = urlObj.pathname;

    // On enlève le préfixe /api/github s'il est présent
    if (githubPath.startsWith('/api/github')) {
        githubPath = githubPath.replace('/api/github', '');
    }

    const query = urlObj.search;
    const url = `https://api.github.com${githubPath}${query}`;
    const GITHUB_TOKEN = process.env.VITE_GITHUB_TOKEN || process.env.GITHUB_TOKEN;

    try {
        const headers = {
            'Authorization': GITHUB_TOKEN && GITHUB_TOKEN !== 'ton_token_ici' ? `token ${GITHUB_TOKEN}` : '',
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GitGraph-Proxy-Vercel'
        };

        let response = await fetch(url, { headers });

        // GESTION DU 202 (Calcul en cours chez GitHub)
        // Si on demande des stats de commits et que GitHub répond 202, on attend 2s et on réessaie une fois.
        if (response.status === 202 && url.includes('stats/commit_activity')) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            response = await fetch(url, { headers });
        }

        // Transmettre les headers de limitation (Rate Limit) pour info
        const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
        if (rateLimitRemaining) res.setHeader('x-ratelimit-remaining', rateLimitRemaining);

        // Vérifier si la réponse est du JSON avant de parser
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return res.status(response.status).json(data);
        } else {
            const text = await response.text();
            return res.status(response.status).send(text);
        }
    } catch (error) {
        console.error('Vercel Proxy Error:', error);
        return res.status(500).json({
            message: 'Error fetching from GitHub',
            error: error.message
        });
    }
}

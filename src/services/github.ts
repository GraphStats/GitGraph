const PROXY_URL = '/api/github';
const CACHE_PREFIX = 'gitgraph_cache_';
const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes

export interface UserStats {
    login: string;
    name: string;
    avatar_url: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
    location: string;
    blog: string;
}

export interface RepoStats {
    id: number;
    name: string;
    full_name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    languages_url: string;
    created_at: string;
    updated_at: string;
    html_url: string;
    size: number;
    license: {
        name: string;
    } | null;
}

const getCache = (key: string) => {
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    if (!cached) return null;
    try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp > CACHE_DURATION) {
            localStorage.removeItem(CACHE_PREFIX + key);
            return null;
        }
        return data;
    } catch {
        return null;
    }
};

const setCache = (key: string, data: any) => {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
        data,
        timestamp: Date.now()
    }));
};

const handleResponse = async (response: Response, cacheKey?: string) => {
    if (response.status === 403) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'GitHub API Rate Limit Exceeded on server.');
    }
    if (!response.ok && response.status !== 202) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }
    const data = await response.json();
    if (cacheKey && response.status !== 202) setCache(cacheKey, data);
    return data;
};

export const githubService = {
    async getUser(username: string): Promise<UserStats> {
        const cacheKey = `user_${username}`;
        const cached = getCache(cacheKey);
        if (cached) return cached;

        const response = await fetch(`${PROXY_URL}/users/${username}`);
        return handleResponse(response, cacheKey);
    },

    async getRepos(username: string): Promise<RepoStats[]> {
        const cacheKey = `repos_${username}`;
        const cached = getCache(cacheKey);
        if (cached) return cached;

        const response = await fetch(`${PROXY_URL}/users/${username}/repos?sort=updated&per_page=100`);
        return handleResponse(response, cacheKey);
    },

    async getRepo(owner: string, repo: string): Promise<RepoStats> {
        const cacheKey = `repo_${owner}_${repo}`;
        const cached = getCache(cacheKey);
        if (cached) return cached;

        const response = await fetch(`${PROXY_URL}/repos/${owner}/${repo}`);
        return handleResponse(response, cacheKey);
    },

    async getRepoLanguages(url: string): Promise<Record<string, number>> {
        const path = url.replace('https://api.github.com/', '');
        const cacheKey = `langs_${btoa(path)}`;
        const cached = getCache(cacheKey);
        if (cached) return cached;

        const response = await fetch(`${PROXY_URL}/${path}`);
        if (response.status === 403) return {};
        if (!response.ok) return {};
        const data = await response.json();
        setCache(cacheKey, data);
        return data;
    },

    async getCommitActivity(owner: string, repo: string): Promise<any[]> {
        const cacheKey = `activity_${owner}_${repo}`;
        const cached = getCache(cacheKey);
        if (cached) return cached;

        let response = await fetch(`${PROXY_URL}/repos/${owner}/${repo}/stats/commit_activity`);

        if (response.status === 202) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            response = await fetch(`${PROXY_URL}/repos/${owner}/${repo}/stats/commit_activity`);
        }

        if (response.status !== 200) return [];

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
            setCache(cacheKey, data);
        }
        return data;
    },

    async getUserCommitActivity(_username: string, repos: RepoStats[]): Promise<any[]> {
        const activeRepos = [...repos]
            .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            .slice(0, 8);

        const activities = await Promise.all(
            activeRepos.map(repo => {
                const [owner, name] = repo.full_name.split('/');
                return this.getCommitActivity(owner, name);
            })
        );

        const merged: Record<number, number> = {};
        activities.forEach(repoActivity => {
            if (Array.isArray(repoActivity)) {
                repoActivity.forEach(week => {
                    merged[week.week] = (merged[week.week] || 0) + (week.total || 0);
                });
            }
        });

        return Object.entries(merged)
            .map(([week, total]) => ({ week: parseInt(week), total }))
            .sort((a, b) => a.week - b.week);
    }
};

import axios from 'axios';

const API_URL = (typeof
        import.meta !== 'undefined' &&
        import.meta.env &&
        import.meta.env.VITE_API_URL) ?
    import.meta.env.VITE_API_URL :
    'http://localhost:8000/api/v1';

const apiClient = axios.create({
    baseURL: API_URL,
    // Needed so browser sends/receives HttpOnly refresh cookies
    withCredentials: true,
});

if (typeof
    import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.DEV) {
    console.info('[API] baseURL =', API_URL);
    console.info('[API] Initializing API client...');
}

let isRefreshing = false;
let refreshPromise = null;

apiClient.interceptors.response.use(
    (response) => response,
    async(error) => {
        const originalRequest = (error && error.config) ? error.config : {};
        const baseURL = (originalRequest && originalRequest.baseURL) ? originalRequest.baseURL : '';
        const urlPath = (originalRequest && originalRequest.url) ? originalRequest.url : '';
        const url = `${baseURL}${urlPath}`;

        const method = (originalRequest && originalRequest.method) ? originalRequest.method : undefined;
        const status = (error && error.response && typeof error.response.status !== 'undefined') ? error.response.status : undefined;
        const data = (error && error.response && typeof error.response.data !== 'undefined') ? error.response.data : undefined;

        if (typeof
            import.meta !== 'undefined' &&
            import.meta.env &&
            import.meta.env.DEV) {
            console.error('[API] request failed', { url, method, status, data });
        }

        // Avoid attempting to refresh on the refresh endpoint itself to prevent loops
        const isRefreshEndpoint = typeof urlPath === 'string' && urlPath.includes('/auth/refresh');

        // Attempt a single refresh on 401 responses
        if (status === 401 && !originalRequest._retry && !isRefreshEndpoint) {
            originalRequest._retry = true;

            try {
                if (!isRefreshing) {
                    isRefreshing = true;
                    refreshPromise = apiClient.post('/auth/refresh');
                }
                const refreshResp = await refreshPromise;
                const newToken = (refreshResp && refreshResp.data && refreshResp.data.access_token) ? refreshResp.data.access_token : undefined;
                if (newToken) {
                    try {
                        localStorage.setItem('genFutureToken', newToken);
                    } catch {}
                    // Update header for retried request
                    originalRequest.headers = originalRequest.headers || {};
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    if (typeof
                        import.meta !== 'undefined' &&
                        import.meta.env &&
                        import.meta.env.DEV) {
                        console.info('[API] token refreshed; retrying original request', { url: originalRequest.url });
                    }
                    return apiClient(originalRequest);
                }
            } catch (refreshErr) {
                if (typeof
                    import.meta !== 'undefined' &&
                    import.meta.env &&
                    import.meta.env.DEV) {
                    const rStatus = (refreshErr && refreshErr.response && typeof refreshErr.response.status !== 'undefined') ? refreshErr.response.status : undefined;
                    const rData = (refreshErr && refreshErr.response && typeof refreshErr.response.data !== 'undefined') ? refreshErr.response.data : undefined;
                    console.error('[API] token refresh failed', { status: rStatus, data: rData });
                }
                try {
                    localStorage.removeItem('genFutureToken');
                } catch {}
            } finally {
                isRefreshing = false;
                refreshPromise = null;
            }
        }

        if (status === 401) {
            try {
                localStorage.removeItem('genFutureToken');
            } catch {}
        }

        return Promise.reject(error);
    }
);

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('genFutureToken');
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        } else if (config.headers && config.headers.Authorization) {
            // Ensure stale header is cleared if token missing
            delete config.headers.Authorization;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const login = (email, password) => {
    // FastAPI's OAuth2PasswordRequestForm expects application/x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    return apiClient.post('/auth/token', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
};

export const register = (userData) => {
    const payload = {
        email: userData.email,
        first_name: (userData.first_name !== undefined && userData.first_name !== null) ? userData.first_name : userData.firstName,
        last_name: (userData.last_name !== undefined && userData.last_name !== null) ? userData.last_name : userData.lastName,
        password: userData.password,
    };
    return apiClient.post('/auth/register', payload);
};

export const getCurrentUser = () => {
    return apiClient.get('/users/me');
};

export const getNearbyUniversities = (latitude, longitude, limit, offset, extra = {}) => {
    const params = { latitude, longitude };
    if (typeof limit !== 'undefined') params.limit = limit;
    if (typeof offset !== 'undefined') params.offset = offset;

    // Optional filters aligned with backend nearby-lite filters
    if (extra && typeof extra === 'object') {
        if (typeof extra.country !== 'undefined') params.country = extra.country;
        if (typeof extra.type !== 'undefined') params.type = extra.type;
        if (typeof extra.rankingMin !== 'undefined') params.ranking_min = extra.rankingMin;
        if (typeof extra.rankingMax !== 'undefined') params.ranking_max = extra.rankingMax;
    }

    return apiClient.get('/universities/nearby-lite', { params });
};

export const getUniversityCourses = (universityId, limit, offset) => {
    const params = {};
    if (typeof limit !== 'undefined') params.limit = limit;
    if (typeof offset !== 'undefined') params.offset = offset;
    return apiClient.get(`/universities/${universityId}/courses`, { params });
};

export const getCourseCareerPaths = (courseId, limit, offset) => {
    const params = {};
    if (typeof limit !== 'undefined') params.limit = limit;
    if (typeof offset !== 'undefined') params.offset = offset;
    return apiClient.get(`/courses/${courseId}/career-paths`, { params });
};

export const searchUniversitiesExternal = (name, country) => {
    return apiClient.get('/external/universities/search', {
        params: { name, country },
    });
};

export const getCourseCareersExternal = (courseId) => {
    return apiClient.get(`/external/careers/by-course/${courseId}`);
};
// API Configuration
const API_URL = window.location.origin + '/api';

// Auth helpers
function getToken() {
    return localStorage.getItem('token');
}

function getUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
}

function setAuth(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

function clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

function logout() {
    clearAuth();
    window.location.href = '/';
}

// API helpers
async function apiCall(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Request failed' }));
        throw new Error(error.detail || 'Request failed');
    }

    return response.json();
}

// Update navbar based on auth state
function updateNavbar() {
    const user = getUser();
    const navbarActions = document.getElementById('navbarActions');
    
    if (!navbarActions) return;

    if (user) {
        const dashboardUrl = user.user_type === 'client' ? '/client-dashboard.html' : '/barbershop-dashboard.html';
        navbarActions.innerHTML = `
            <span class="navbar-user">${user.name}</span>
            <a href="${dashboardUrl}">
                <button class="btn btn-secondary btn-small">Dashboard</button>
            </a>
            <button onclick="logout()" class="btn btn-ghost btn-small">Sair</button>
        `;
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNavbar);
} else {
    updateNavbar();
}
// IMPORTANT: this must point at the real deployed backend URL, not localhost.
const API_URL = 'https://login-system-backend-2o9m.onrender.com';

function showError(message) {
  const box = document.getElementById('error-box');
  if (!box) return;
  box.textContent = message;
  box.classList.remove('hidden');
}

function clearError() {
  const box = document.getElementById('error-box');
  if (!box) return;
  box.classList.add('hidden');
  box.textContent = '';
}

// ---------- index.html: login / register toggle + submit ----------
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');

if (showRegisterLink && showLoginLink) {
  showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    clearError();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
  });

  showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    clearError();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.message || 'Login failed.');
        return;
      }

      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    } catch (err) {
      showError('Could not reach the server. Please try again.');
    }
  });
}

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.message || 'Registration failed.');
        return;
      }

      // Auto-switch to login after successful registration
      registerForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
      document.getElementById('login-email').value = email;
      showError('Account created! You can now log in.');
    } catch (err) {
      showError('Could not reach the server. Please try again.');
    }
  });
}

// ---------- dashboard.html: fetch profile / logout ----------
const dashContent = document.getElementById('dash-content');
const dashLoading = document.getElementById('dash-loading');
const logoutBtn = document.getElementById('logout-btn');

if (dashContent) {
  (async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = 'index.html';
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
        return;
      }

      const data = await res.json();

      document.getElementById('dash-name').textContent = data.user.name;
      document.getElementById('dash-email').textContent = data.user.email;

      dashLoading.classList.add('hidden');
      dashContent.classList.remove('hidden');
    } catch (err) {
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    }
  })();
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  });
}

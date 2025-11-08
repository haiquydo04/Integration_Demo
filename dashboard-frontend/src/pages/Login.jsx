import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('manager@company.com');
  const [password, setPassword] = useState('securePass!2025');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      setError('');
      login(email.trim(), password.trim());
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message ?? 'Unable to authenticate');
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <header className="auth-card__header">
          <h1>HR Insights Dashboard</h1>
          <p>Access restricted to senior managers. Enter your credentials to continue.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Corporate Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
            required
          />

          <label htmlFor="password">Access Code</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button type="submit" className="primary-button">
            Sign in
          </button>
        </form>

        <footer className="auth-card__footer">
          <p>
            Demo credentials:&nbsp;
            <code>manager@company.com</code> / <code>securePass!2025</code>
          </p>
        </footer>
      </div>
    </div>
  );
}


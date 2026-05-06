import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      await login(email, password);
      navigate('/products');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetMessage('');
    
    try {
      await resetPassword(resetEmail);
      setResetMessage('Password reset link sent to your email! Check console for demo.');
      setTimeout(() => {
        setShowReset(false);
        setResetMessage('');
        setResetEmail('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Email not found. Please check and try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Login</h2>
        {error && <div style={styles.error}>{error}</div>}
        
        {!showReset ? (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={styles.passwordInput}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.showPasswordBtn}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            
            <button type="submit" style={styles.button}>
              Login
            </button>
            
            <div style={styles.links}>
              <Link to="/signup" style={styles.link}>
                Create new account
              </Link>
              <button
                onClick={() => setShowReset(true)}
                style={styles.linkButton}
              >
                Forgot password?
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email for password reset</label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your registered email"
                required
                style={styles.input}
              />
            </div>
            
            {resetMessage && <div style={styles.success}>{resetMessage}</div>}
            {error && <div style={styles.error}>{error}</div>}
            
            <button type="submit" style={styles.button}>
              Send Reset Link
            </button>
            
            <button
              type="button"
              onClick={() => {
                setShowReset(false);
                setError('');
              }}
              style={styles.linkButton}
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 80px)',
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: '30px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  passwordContainer: {
    display: 'flex',
    gap: '10px',
    position: 'relative' as const,
  },
  passwordInput: {
    flex: 1,
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  showPasswordBtn: {
    position: 'absolute' as const,
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#4fc3f7',
    cursor: 'pointer',
    fontSize: '14px',
  },
  button: {
    backgroundColor: '#4fc3f7',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#45b5e6',
    },
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px',
    textAlign: 'center' as const,
    fontSize: '14px',
  },
  success: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '10px',
    borderRadius: '4px',
    textAlign: 'center' as const,
    fontSize: '14px',
  },
  links: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  link: {
    color: '#4fc3f7',
    textDecoration: 'none',
    fontSize: '14px',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  linkButton: {
    color: '#4fc3f7',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'underline',
    ':hover': {
      color: '#45b5e6',
    },
  },
} as const;
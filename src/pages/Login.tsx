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
  const [isPasswordHovered, setIsPasswordHovered] = useState(false);
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Validate email format
  const validateEmailFormat = (email: string) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation checks
  const validatePassword = (pass: string, emailAddress: string) => {
    const checks = {
      length: pass.length >= 8,
      notInEmail: emailAddress ? !pass.toLowerCase().includes(emailAddress.toLowerCase().split('@')[0]) : true,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*]/.test(pass)
    };
    return checks;
  };

  const validateEmail = (email: string) => {
    if (email.length > 50) {
      return 'Email must be at most 50 characters';
    }
    if (!validateEmailFormat(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    if (!email || !password) {
      return false;
    }
    if (email.length > 50) {
      return false;
    }
    if (!validateEmailFormat(email)) {
      return false;
    }
    
    // Check password requirements
    const passwordChecks = validatePassword(password, email);
    if (!passwordChecks.length || !passwordChecks.notInEmail || 
        !passwordChecks.uppercase || !passwordChecks.lowercase || 
        !passwordChecks.number || !passwordChecks.special) {
      return false;
    }
    
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setEmail(value);
    }
  };

  const handleResetEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setResetEmail(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    
    // Check password requirements before login
    const passwordChecks = validatePassword(password, email);
    if (!passwordChecks.length || !passwordChecks.notInEmail || 
        !passwordChecks.uppercase || !passwordChecks.lowercase || 
        !passwordChecks.number || !passwordChecks.special) {
      setError('Password does not meet the requirements. Hover over password field for details.');
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
    
    if (!resetEmail) {
      setError('Please enter your email address');
      return;
    }
    
    const emailError = validateEmail(resetEmail);
    if (emailError) {
      setError(emailError);
      return;
    }
    
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

  const passwordChecks = validatePassword(password, email);
  const formValid = isFormValid();

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Please sign in to your account</p>
        
        {error && <div style={styles.error}>{error}</div>}
        
        {!showReset ? (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Email Address <span style={styles.required}>*</span>
              </label>
              <div style={styles.emailContainer}>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  required
                  style={{
                    ...styles.input,
                    ...(email && !validateEmail(email) && validateEmailFormat(email) ? styles.inputValid : {}),
                    ...(email && validateEmail(email) ? styles.inputInvalid : {})
                  }}
                />
                <div style={styles.characterCounter}>
                  <span style={{
                    ...styles.counterText,
                    ...(email.length > 45 ? styles.counterWarning : {}),
                    ...(email.length >= 50 ? styles.counterError : {})
                  }}>
                    {email.length}/50
                  </span>
                </div>
              </div>
              <div style={styles.emailHelpText}>
                Email must be at most 50 characters and in valid format (e.g., name@example.com)
              </div>
              {email && email.length > 0 && !validateEmailFormat(email) && (
                <div style={styles.hintError}>Please enter a valid email address</div>
              )}
              {email && validateEmailFormat(email) && email.length > 0 && email.length <= 50 && (
                <div style={styles.hintSuccess}>✓ Valid email format</div>
              )}
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Password <span style={styles.required}>*</span>
              </label>
              <div 
                style={styles.passwordWrapper}
                onMouseEnter={() => setIsPasswordHovered(true)}
                onMouseLeave={() => setIsPasswordHovered(false)}
              >
                <div style={styles.passwordContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    style={styles.input}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.showPasswordBtn}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                
                {/* Hover Popup Tooltip */}
                {isPasswordHovered && (
                  <div style={styles.passwordTooltip}>
                    <div style={styles.tooltipTitle}>
                      Password Requirements:
                    </div>
                    <div style={styles.tooltipList}>
                      <div style={{
                        ...styles.tooltipItem,
                        color: passwordChecks.length ? '#4caf50' : '#f44336'
                      }}>
                        {passwordChecks.length ? '✓' : '❌'} Minimum of eight (8) characters in length
                      </div>
                      <div style={{
                        ...styles.tooltipItem,
                        color: passwordChecks.notInEmail ? '#4caf50' : '#f44336'
                      }}>
                        {passwordChecks.notInEmail ? '✓' : '❌'} Cannot be part of Email Address
                      </div>
                      <div style={{
                        ...styles.tooltipItem,
                        color: passwordChecks.uppercase ? '#4caf50' : '#f44336'
                      }}>
                        {passwordChecks.uppercase ? '✓' : '❌'} At least one (1) uppercase letter (A-Z)
                      </div>
                      <div style={{
                        ...styles.tooltipItem,
                        color: passwordChecks.lowercase ? '#4caf50' : '#f44336'
                      }}>
                        {passwordChecks.lowercase ? '✓' : '❌'} At least one (1) lowercase letter (a-z)
                      </div>
                      <div style={{
                        ...styles.tooltipItem,
                        color: passwordChecks.number ? '#4caf50' : '#f44336'
                      }}>
                        {passwordChecks.number ? '✓' : '❌'} At least one (1) number (0-9)
                      </div>
                      <div style={{
                        ...styles.tooltipItem,
                        color: passwordChecks.special ? '#4caf50' : '#f44336'
                      }}>
                        {passwordChecks.special ? '✓' : '❌'} At least one (1) special character (!, @, #, $, %, ^, &, *)
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <button 
              type="submit" 
              style={{
                ...styles.button,
                ...(!formValid ? styles.buttonDisabled : {})
              }}
              disabled={!formValid}
            >
              Sign In
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
              <label style={styles.label}>
                Email Address <span style={styles.required}>*</span>
              </label>
              <div style={styles.emailContainer}>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={handleResetEmailChange}
                  placeholder="Enter your registered email"
                  required
                  style={{
                    ...styles.input,
                    ...(resetEmail && !validateEmail(resetEmail) && validateEmailFormat(resetEmail) ? styles.inputValid : {}),
                    ...(resetEmail && validateEmail(resetEmail) ? styles.inputInvalid : {})
                  }}
                />
                <div style={styles.characterCounter}>
                  <span style={{
                    ...styles.counterText,
                    ...(resetEmail.length > 45 ? styles.counterWarning : {}),
                    ...(resetEmail.length >= 50 ? styles.counterError : {})
                  }}>
                    {resetEmail.length}/50
                  </span>
                </div>
              </div>
              <div style={styles.emailHelpText}>
                Email must be at most 50 characters and in valid format (e.g., name@example.com)
              </div>
              {resetEmail && resetEmail.length > 0 && !validateEmailFormat(resetEmail) && (
                <div style={styles.hintError}>Please enter a valid email address</div>
              )}
              {resetEmail && validateEmailFormat(resetEmail) && resetEmail.length > 0 && resetEmail.length <= 50 && (
                <div style={styles.hintSuccess}>✓ Valid email format</div>
              )}
            </div>
            
            {resetMessage && <div style={styles.success}>{resetMessage}</div>}
            {error && <div style={styles.error}>{error}</div>}
            
            <button 
              type="submit" 
              style={{
                ...styles.button,
                ...(!resetEmail || !validateEmailFormat(resetEmail) || resetEmail.length > 50 ? styles.buttonDisabled : {})
              }}
              disabled={!resetEmail || !validateEmailFormat(resetEmail) || resetEmail.length > 50}
            >
              Send Reset Link
            </button>
            
            <button
              type="button"
              onClick={() => {
                setShowReset(false);
                setError('');
              }}
              style={styles.backButton}
            >
              ← Back to Login
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
    backgroundColor: '#f0f2f5',
    padding: '20px',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '450px',
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: '8px',
    color: '#1a1a2e',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center' as const,
    marginBottom: '30px',
    color: '#666',
    fontSize: '14px',
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
    fontWeight: '600',
    color: '#333',
  },
  required: {
    color: '#f44336',
    fontSize: '12px',
  },
  emailContainer: {
    position: 'relative' as const,
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    paddingRight: '60px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s',
    backgroundColor: '#fff',
    boxSizing: 'border-box' as const,
    ':focus': {
      borderColor: '#4fc3f7',
      boxShadow: '0 0 0 3px rgba(79, 195, 247, 0.1)',
    },
  },
  inputValid: {
    borderColor: '#4caf50',
    borderWidth: '2px',
  },
  inputInvalid: {
    borderColor: '#f44336',
    borderWidth: '2px',
  },
  characterCounter: {
    position: 'absolute' as const,
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'white',
    paddingLeft: '5px',
    pointerEvents: 'none' as const,
  },
  counterText: {
    fontSize: '12px',
    color: '#999',
  },
  counterWarning: {
    color: '#ff9800',
    fontWeight: 'bold' as const,
  },
  counterError: {
    color: '#f44336',
    fontWeight: 'bold' as const,
  },
  emailHelpText: {
    fontSize: '12px',
    color: '#999',
    marginTop: '4px',
    lineHeight: '1.4',
  },
  hintSuccess: {
    color: '#4caf50',
    fontSize: '12px',
    marginTop: '4px',
  },
  hintError: {
    color: '#f44336',
    fontSize: '12px',
    marginTop: '4px',
  },
  passwordWrapper: {
    position: 'relative' as const,
    width: '100%',
  },
  passwordContainer: {
    position: 'relative' as const,
    width: '100%',
  },
  showPasswordBtn: {
    position: 'absolute' as const,
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#4fc3f7',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '4px',
    zIndex: 1,
    ':hover': {
      backgroundColor: '#f0f0f0',
    },
  },
  passwordTooltip: {
    position: 'absolute' as const,
    top: '100%',
    left: '0',
    marginTop: '10px',
    width: '320px',
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    padding: '16px',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease-in-out',
  },
  tooltipTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '2px solid #4fc3f7',
  },
  tooltipList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  tooltipItem: {
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    lineHeight: '1.5',
    padding: '4px 0',
  },
  button: {
    backgroundColor: '#4fc3f7',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '10px',
    ':hover': {
      backgroundColor: '#45b5e6',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(79, 195, 247, 0.3)',
    },
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
    opacity: 0.6,
    ':hover': {
      backgroundColor: '#ccc',
      transform: 'none',
      boxShadow: 'none',
    },
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center' as const,
    fontSize: '13px',
  },
  success: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center' as const,
    fontSize: '13px',
  },
  links: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px solid #f0f0f0',
  },
  link: {
    color: '#4fc3f7',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '500',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  linkButton: {
    color: '#4fc3f7',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#4fc3f7',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    marginTop: '15px',
    padding: '8px',
    width: '100%',
    textAlign: 'center' as const,
    borderRadius: '6px',
    transition: 'backgroundColor 0.3s',
    ':hover': {
      backgroundColor: '#f5f5f5',
    },
  },
} as const;

// Add animation styles
const globalStyles = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}
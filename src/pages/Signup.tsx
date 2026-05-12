import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Signup: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordHovered, setIsPasswordHovered] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

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

  const getPasswordErrors = (pass: string, emailAddress: string) => {
    const errors = [];
    if (pass.length < 8) errors.push('Minimum of eight (8) characters in length');
    if (emailAddress && pass.toLowerCase().includes(emailAddress.toLowerCase().split('@')[0])) {
      errors.push('Cannot be part of Email Address');
    }
    if (!/[A-Z]/.test(pass)) errors.push('At least one (1) uppercase letter (A-Z)');
    if (!/[a-z]/.test(pass)) errors.push('At least one (1) lowercase letter (a-z)');
    if (!/[0-9]/.test(pass)) errors.push('At least one (1) number (0-9)');
    if (!/[!@#$%^&*]/.test(pass)) errors.push('At least one (1) special character (!, @, #, $, %, ^, &, *)');
    return errors;
  };

  const validateName = (name: string) => {
    if (name.length < 4) {
      return 'First name must be at least 4 characters';
    }
    return null;
  };

  const validateEmail = (email: string) => {
    if (email.length > 50) {
      return 'Email must be at most 50 characters';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setEmail(value);
    }
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    // Check required fields
    if (!firstName || !email || !password || !confirmPassword) {
      return false;
    }
    
    // Validate first name
    if (firstName.length < 4) {
      return false;
    }
    
    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      return false;
    }
    
    // Validate password
    const passwordErrors = getPasswordErrors(password, email);
    if (passwordErrors.length > 0) {
      return false;
    }
    
    // Validate confirm password
    if (password !== confirmPassword) {
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate first name
    const firstNameError = validateName(firstName);
    if (firstNameError) {
      setError(firstNameError);
      return;
    }
    
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    
    const passwordErrors = getPasswordErrors(password, email);
    if (passwordErrors.length > 0) {
      setError(`Password requirements not met:\n${passwordErrors.join('\n')}`);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await signup(email, password, firstName);
      navigate('/products');
    } catch (err: any) {
      setError(err.message || 'Error creating account. Email might already exist.');
    }
  };

  const passwordChecks = validatePassword(password, email);
  const formValid = isFormValid();

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Sign Up</h2>
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              First Name <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
              required
              style={{
                ...styles.input,
                ...(firstName && firstName.length >= 4 ? styles.inputValid : {}),
                ...(firstName && firstName.length < 4 ? styles.inputInvalid : {})
              }}
            />
            {firstName && firstName.length < 4 && (
              <div style={styles.hintError}>
                First name must be at least 4 characters (current: {firstName.length})
              </div>
            )}
            {firstName && firstName.length >= 4 && (
              <div style={styles.hintSuccess}>✓ First name is valid</div>
            )}
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Email <span style={styles.required}>*</span>
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
                  ...(email && !validateEmail(email) ? styles.inputValid : {}),
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
            {email && email.length > 0 && (
              <div style={styles.emailHint}>
                {!validateEmail(email) ? (
                  <span style={styles.hintSuccess}>✓ Valid email format</span>
                ) : (
                  <span style={styles.hintError}>⚠ Invalid email format</span>
                )}
                {email.length <= 40 && !validateEmail(email) && (
                  <span style={styles.hintSuccess}> ✓ Good length</span>
                )}
                {email.length > 40 && email.length < 50 && !validateEmail(email) && (
                  <span style={styles.hintWarning}> ⚠ Getting long (max 50)</span>
                )}
                {email.length === 50 && !validateEmail(email) && (
                  <span style={styles.hintError}> ⚠ Maximum characters reached</span>
                )}
              </div>
            )}
            <div style={styles.passwordHint}>
              Email must be at most 50 characters and in valid format (e.g., name@example.com)
            </div>
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
                  placeholder="Create a password"
                  required
                  style={{
                    ...styles.passwordInput,
                    ...(password && getPasswordErrors(password, email).length === 0 ? styles.inputValid : {}),
                    ...(password && getPasswordErrors(password, email).length > 0 ? styles.inputInvalid : {})
                  }}
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
                  <div style={styles.tooltipTitle}>Password Requirements:</div>
                  <div style={styles.tooltipList}>
                    <div style={{
                      ...styles.tooltipItem,
                      color: passwordChecks.length ? '#4caf50' : '#f44336'
                    }}>
                      {passwordChecks.length ? '✓' : '✗'} Minimum 8 characters
                    </div>
                    <div style={{
                      ...styles.tooltipItem,
                      color: passwordChecks.notInEmail ? '#4caf50' : '#f44336'
                    }}>
                      {passwordChecks.notInEmail ? '✓' : '✗'} Cannot be part of email
                    </div>
                    <div style={{
                      ...styles.tooltipItem,
                      color: passwordChecks.uppercase ? '#4caf50' : '#f44336'
                    }}>
                      {passwordChecks.uppercase ? '✓' : '✗'} One uppercase letter
                    </div>
                    <div style={{
                      ...styles.tooltipItem,
                      color: passwordChecks.lowercase ? '#4caf50' : '#f44336'
                    }}>
                      {passwordChecks.lowercase ? '✓' : '✗'} One lowercase letter
                    </div>
                    <div style={{
                      ...styles.tooltipItem,
                      color: passwordChecks.number ? '#4caf50' : '#f44336'
                    }}>
                      {passwordChecks.number ? '✓' : '✗'} One number
                    </div>
                    <div style={{
                      ...styles.tooltipItem,
                      color: passwordChecks.special ? '#4caf50' : '#f44336'
                    }}>
                      {passwordChecks.special ? '✓' : '✗'} One special character (!@#$%^&*)
                    </div>
                  </div>
                </div>
              )}
            </div>
            {password && getPasswordErrors(password, email).length === 0 && (
              <div style={styles.hintSuccess}>✓ Password meets all requirements</div>
            )}
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Confirm Password <span style={styles.required}>*</span>
            </label>
            <div style={styles.passwordContainer}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                style={{
                  ...styles.passwordInput,
                  ...(confirmPassword && password === confirmPassword ? styles.inputValid : {}),
                  ...(confirmPassword && password !== confirmPassword ? styles.inputInvalid : {})
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.showPasswordBtn}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <div style={styles.hintError}>Passwords do not match</div>
            )}
            {confirmPassword && password === confirmPassword && password && (
              <div style={styles.hintSuccess}>✓ Passwords match</div>
            )}
          </div>
          
          <button 
            type="submit" 
            style={{
              ...styles.button,
              ...(!formValid ? styles.buttonDisabled : {})
            }}
            disabled={!formValid}
          >
            Sign Up
          </button>
          
          <div style={styles.links}>
            <Link to="/login" style={styles.link}>
              Already have an account? Login
            </Link>
          </div>
        </form>
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
    padding: '20px',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: '30px',
    color: '#333',
    fontSize: '28px',
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
  required: {
    color: '#f44336',
    fontSize: '12px',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s',
    width: '100%',
    ':focus': {
      borderColor: '#4fc3f7',
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
  emailContainer: {
    position: 'relative' as const,
    width: '100%',
  },
  characterCounter: {
    position: 'absolute' as const,
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'white',
    paddingLeft: '5px',
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
  emailHint: {
    fontSize: '12px',
    marginTop: '4px',
  },
  hintSuccess: {
    color: '#4caf50',
    fontSize: '12px',
    marginTop: '4px',
  },
  hintWarning: {
    color: '#ff9800',
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
    ':focus': {
      borderColor: '#4fc3f7',
    },
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
    fontWeight: 'bold',
    ':hover': {
      color: '#45b5e6',
    },
  },
  passwordTooltip: {
    position: 'absolute' as const,
    top: '100%',
    left: '0',
    marginTop: '10px',
    width: '280px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    padding: '15px',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease-in-out',
  },
  tooltipTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
    paddingBottom: '8px',
    borderBottom: '1px solid #eee',
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
    lineHeight: '1.4',
  },
  passwordHint: {
    fontSize: '12px',
    color: '#999',
    lineHeight: '1.4',
    marginTop: '4px',
  },
  button: {
    backgroundColor: '#4fc3f7',
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '10px',
    ':hover': {
      backgroundColor: '#45b5e6',
    },
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed',
    opacity: 0.6,
    ':hover': {
      backgroundColor: '#cccccc',
    },
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    textAlign: 'center' as const,
    fontSize: '14px',
    whiteSpace: 'pre-line' as const,
  },
  links: {
    textAlign: 'center' as const,
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
} as const;

// Add this to your global CSS or index.css for animation
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
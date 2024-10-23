import React, { useState } from 'react';
import axios from 'axios';

function AdminAuth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);  // Toggle between login and signup

  // Handle login or signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isSignup ? '/api/admin/signup' : '/api/admin/login';
      const response = await axios.post(endpoint, { username, password });
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        window.location.href = '/admin';  // Redirect to admin dashboard
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError(isSignup ? 'Failed to sign up' : 'Failed to login');
    }
  };

  return (
    <div>
      <h2>{isSignup ? 'Admin Signup' : 'Admin Login'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
      </form>
      <p>
        {isSignup ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
        <button onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Login here' : 'Sign up here'}
        </button>
      </p>
    </div>
  );
}

export default AdminAuth;


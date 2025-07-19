import React from 'react';
import { Link } from 'react-router-dom';

export default function Nav() {
  return (
    <nav style={{ padding: '1rem', backgroundColor: '#eee' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Login</Link>
      <Link to="/register" style={{ marginRight: '1rem' }}>Register</Link>
      <Link to="/search">Search Movies</Link>
    </nav>
  );
}

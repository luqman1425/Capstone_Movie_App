import React from 'react';
import '../styles/Register.css';


function Register() {
  return (
    <div className="register-container">
      <h2>Register</h2>
      <form>
        <input placeholder="Email" />
        <input placeholder="Password" type="password" />
        <input placeholder="Confirm Password" type="password" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;

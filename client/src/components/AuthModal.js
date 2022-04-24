import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useCookies} from 'react-cookie';
import axios from 'axios';
const AuthModal = ({setShowModal, isSignup}) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const [cookie, setCookie, removeCookie] = useCookies(['user']);
  const handleClick = () => {
    setShowModal(false);
  };

  let navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      if (isSignup && password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      } else {
        const response = await axios.post(
          `http://localhost:5000/${isSignup ? 'signup' : 'login'}`,
          {email, password}
        );

        setCookie('UserId', response.data.userId);
        setCookie('AuthToken', response.data.token);
        const success = response.status === 201;
        if (success && isSignup) navigate('/onboarding');
        if (success && !isSignup) navigate('/dashboard');

        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="auth-modal">
      <div className="close-icon" onClick={handleClick}>
        x
      </div>
      <h2>{isSignup ? 'CREATE ACCOUNT' : 'LOG IN'}</h2>
      <p>
        By clicking log in you are to our terms. Learn how we process your data in our Privacy
        Policy.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="email"
          required={true}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="password"
          required={true}
          onChange={e => setPassword(e.target.value)}
        />
        {isSignup && (
          <input
            type="password"
            id="passwordCheck"
            name="passwordCheck"
            placeholder="confirm password"
            required={true}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        )}
        <button className="secondary-button">Submit</button>
        <p>{error}</p>
      </form>
      <hr />
      <h2>GET THE APP</h2>
    </div>
  );
};

export default AuthModal;

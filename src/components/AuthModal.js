import React, {useState} from 'react';

const AuthModal = ({setShowModal, isSignup}) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const handleClick = () => {
    setShowModal(false);
  };

  const handleSubmit = e => {
    e.preventDefault();

    try {
      if (isSignup && password !== confirmPassword) {
        setError('Passwords do not match');
      }
      console.log('make a post request');
    } catch (error) {
      console.log(error);
    }
  };

  console.log(email, password, confirmPassword);
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

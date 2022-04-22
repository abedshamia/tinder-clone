import React, {useState} from 'react';
import AuthModal from '../components/AuthModal';
import Nav from '../components/Nav';

const Home = () => {
  const [showModal, setShowModal] = useState(false);

  // For signup form
  const [isSignUp, setIsSignUp] = useState(true);
  const authToken = false;

  const handleClick = () => {
    console.log('clicked');
    setShowModal(true);
    setIsSignUp(true);
  };
  return (
    <div className="overlay">
      <Nav
        minimal={false}
        setShowModal={setShowModal}
        showModal={showModal}
        setIsSignUp={setIsSignUp}
      />
      <div className="home">
        <h1 className="primary-title">Swipe Right&copy;</h1>
        <button className="primary-button" onClick={handleClick}>
          {authToken ? 'Signout' : 'Create Account'}
        </button>
        {showModal && <AuthModal setShowModal={setShowModal} isSignup={isSignUp} />}
      </div>
    </div>
  );
};

export default Home;

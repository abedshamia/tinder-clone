import React from 'react';
import logo from '../images/tinder_logo_white.png';
import colorLogo from '../images/color-logo-tinder.png';

const Nav = ({minimal, authToken}) => {
  return (
    <nav>
      <div className="logo-container">
        <img src={minimal ? colorLogo : logo} alt="logo" className="logo" />
      </div>

      {!authToken && !minimal && <button className="nav-button">Log in</button>}
    </nav>
  );
};

export default Nav;

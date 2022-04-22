import React from 'react';
import {useCookies} from 'react-cookie';

const ChatHeader = ({user}) => {
  const [cookie, setCookie, removeCookie] = useCookies(['user']);
  const logout = () => {
    removeCookie('UserId', cookie.UserId);
    removeCookie('AuthToken', cookie.AuthToken);
    window.location.reload();
  };
  return (
    <div className="chat-container-header">
      <div className="profile">
        <div className="img-container">
          <img src={user.url} alt="User img" />
        </div>
        <h3>{user.first_name}</h3>
      </div>
      <i className="log-out-icon" onClick={logout}>
        ↩
      </i>
    </div>
  );
};

export default ChatHeader;

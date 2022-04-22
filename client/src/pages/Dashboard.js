import React, {useState} from 'react';
import TinderCard from 'react-tinder-card';
import {useCookies} from 'react-cookie';
import ChatContainer from '../components/ChatContainer';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [genderedUsers, setGenderedUsers] = useState(null);
  const [cookie, setCookie, removeCookie] = useCookies(['user']);

  const userId = cookie.UserId;

  const getUser = async controller => {
    const signal = controller.signal;
    try {
      const response = await axios.get('http://localhost:5000/user', {
        params: {userId},
        signal,
      });

      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getGenderedUsers = async controller => {
    const signal = controller.signal;
    try {
      const response = await axios.get('http://localhost:5000/gendered-users', {
        params: {gender: user?.gender_interest},
        signal,
      });
      setGenderedUsers(response.data);
    } catch (error) {}
  };

  React.useEffect(() => {
    const controller = new AbortController();
    getUser(controller);
    getGenderedUsers(controller);

    return () => {
      controller.abort();
    };
  }, [user, genderedUsers]);

  const [lastDirection, setLastDirection] = useState();

  const swiped = (direction, nameToDelete) => {
    console.log('removing' + nameToDelete);
    setLastDirection(direction);
  };

  const outOfFrame = name => {
    console.log('out of frame' + name);
  };

  return (
    <>
      {user && (
        <div className="dashboard">
          <ChatContainer user={user} />
          <div className="swipe-container">
            <div className="card-container">
              {genderedUsers?.map(genderedUser => (
                <TinderCard
                  className="swipe"
                  key={genderedUser.user_id}
                  onSwipe={dir => swiped(dir, genderedUser.first_name)}
                  onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}
                >
                  <div
                    style={{backgroundImage: 'url(' + genderedUser.url + ')'}}
                    className="card"
                  >
                    <h3>{genderedUser.first_name}</h3>
                  </div>
                </TinderCard>
              ))}
              <div className="swipe-info">
                {lastDirection ? <p>You swiped {lastDirection}</p> : <p />}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;

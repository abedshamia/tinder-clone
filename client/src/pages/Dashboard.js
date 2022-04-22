import React, {useState} from 'react';
import TinderCard from 'react-tinder-card';
import {useCookies} from 'react-cookie';
import ChatContainer from '../components/ChatContainer';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [cookie, setCookie, removeCookie] = useCookies(['user']);

  const characters = [
    {
      name: 'Joker',
      url: 'https://i.pinimg.com/originals/a4/d8/b1/a4d8b1c9c9f9f9c8c9c9f9c8c9c9f9c8.jpg',
    },
  ];
  const userId = cookie.UserId;

  const getUser = async () => {
    try {
      const response = await axios.get('http://localhost:5000/user', {
        params: {userId},
      });

      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getUser();
  }, []);

  console.log('user', user);
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
              {characters.map(character => (
                <TinderCard
                  className="swipe"
                  // key={character.user_id}
                  onSwipe={dir => swiped(dir, character.name)}
                  onCardLeftScreen={() => outOfFrame(character.name)}
                >
                  <div
                    style={{backgroundImage: 'url(' + character.url + ')'}}
                    className="card"
                  >
                    <h3>{character.name}</h3>
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

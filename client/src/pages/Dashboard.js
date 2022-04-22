import React, {useState} from 'react';
import TinderCard from 'react-tinder-card';
import ChatContainer from '../components/ChatContainer';

const Dashboard = () => {
  const characters = [
    {
      name: 'Goku',
      url: 'https://i.imgur.com/oPj4A8u.jpg',
    },
    {
      name: 'Goku',
      url: 'https://i.imgur.com/oPj4A8u.jpg',
    },
    {
      name: 'Goku',
      url: 'https://i.imgur.com/oPj4A8u.jpg',
    },
    {
      name: 'Goku',
      url: 'https://i.imgur.com/oPj4A8u.jpg',
    },
  ];
  const [lastDirection, setLastDirection] = useState();

  const swiped = (direction, nameToDelete) => {
    console.log('removing' + nameToDelete);
    setLastDirection(direction);
  };

  const outOfFrame = name => {
    console.log('out of frame' + name);
  };
  return (
    <div className="dashboard">
      <ChatContainer />
      <div className="swipe-container">
        <div className="card-container">
          {characters.map(character => (
            <TinderCard
              className="swipe"
              // key={character.user_id}
              onSwipe={dir => swiped(dir, character.name)}
              onCardLeftScreen={() => outOfFrame(character.name)}
            >
              <div style={{backgroundImage: 'url(' + character.url + ')'}} className="card">
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
  );
};

export default Dashboard;

import './GameCard.module.css';

const GameCard = ({ name, date }) => {
  return (
    <div className="game-card">
      <div className="game-card-content">
        <h2 className="game-title">{name}</h2>
        <p className="game-date">{date}</p>
      </div>
    </div>
  );
};

export default GameCard;

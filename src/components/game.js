import React, { useState, useEffect } from "react";

const games = [
  "http://ellisonleao.github.io/clumsy-bird/",
  "https://js13kgames.com/games/radius-raid/index.html",
  "https://duckhuntjs.com/",
];

const GameModal = ({ onClose }) => {
  const [gameUrl, setGameUrl] = useState("");

  useEffect(() => {
    const randomGame = games[Math.floor(Math.random() * games.length)];
    setGameUrl(randomGame);
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="game-modal-content">
        <button className="close-button" onClick={onClose}>
          Close
        </button>
        <iframe
          src={gameUrl}
          title="Random Game"
          width="800"
          height="600"
          frameBorder="0"
          style={{ display: "block", margin: "0 auto" }}
        ></iframe>
      </div>
    </div>
  );
};

export default GameModal;

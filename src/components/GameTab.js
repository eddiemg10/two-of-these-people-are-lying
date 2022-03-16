import React, { useState, useEffect } from "react";
import db from "../database/gamerooms";
import { useParams } from "react-router-dom";

function GameTab() {
  const { id } = useParams();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    db.useGetGameArticles(id).then((articles) => {
      shuffleArray(articles);
      setArticles(articles);
    });
  }, []);

  const activateCard = (e) => {
    e.target.className =
      e.target.className === "article-card active"
        ? "article-card"
        : "article-card active";
  };

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  return articles.map((article, index) => (
    <div className="article-card" key={index} onClick={activateCard}>
      {article.text}
    </div>
  ));
}

export default GameTab;

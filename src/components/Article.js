import React, { useState } from "react";
import ArticleForm from "./ArticleForm";
import ArticleList from "./ArticleList";
import { RiCloseCircleLine } from "react-icons/ri";
import { TiEdit } from "react-icons/ti";
import db from "../database/gamerooms";

function Article({ articles, completeArticle, removeArticle, editArticle }) {
  const [edit, setEdit] = useState({
    id: null,
    value: "",
  });

  const submitUpdate = (value) => {
    editArticle(edit.id, value);
    setEdit({
      id: null,
      value: "",
    });
  };

  // if (edit.id) {
  //   return <ArticleForm edit={edit} onSubmit={submitUpdate} />;
  // }

  return articles.map((article, index) => (
    <div
      className={article.isComplete ? "article-row complete" : "article-row"}
      key={index}
    >
      {edit.id === article.id ? (
        <>
          <ArticleForm
            edit={edit}
            onSubmit={submitUpdate}
            val={article.text}
            id={article.id}
          />
        </>
      ) : (
        <>
          <div
            // className={
            //   article.isComplete ? "article-row complete" : "article-row"
            // }
            key={index}
          >
            <div key={article.id} onClick={() => completeArticle(article.id)}>
              {article.text}
            </div>
            <div className="icons">
              <RiCloseCircleLine
                onClick={() => removeArticle(article.id)}
                className="delete-icon"
              />
              <TiEdit
                onClick={() => setEdit({ id: article.id, value: article.text })}
                className="edit-icon"
              />
            </div>
          </div>
        </>
      )}
    </div>
  ));
}

export default Article;

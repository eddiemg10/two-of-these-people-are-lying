import React, { useState, useEffect, useRef } from "react";

function ArticleForm(props) {
  const [input, setInput] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  });

  useEffect(() => {
    let value = props.val ? props.val : "";
    setInput(value);
  }, [props.val]);

  const handleText = (e) => {
    setInput(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    props.onSubmit({
      id: Math.floor(Math.random() * 10000),
      text: input,
    });

    setInput("");
  };

  const handleEdit = (e) => {
    e.preventDefault();

    props.onSubmit({
      id: props.id,
      text: input,
    });

    setInput("");
  };

  // if (props.val) {
  // setInput(props.val);

  let btnContent = props.edit ? "Finish" : "Add entry";

  return (
    <div>
      <form
        className={props.edit ? "article-form-edit" : "article-form"}
        onSubmit={props.edit ? handleEdit : handleSubmit}
      >
        <input
          type="text"
          placeholder="Add entry"
          value={input}
          name="entry"
          className={props.edit ? "article-input edit" : "article-input"}
          onChange={handleText}
          autoComplete="off"
          ref={inputRef}
        />
        <button
          className={props.edit ? "article-button edit" : "article-button"}
        >
          {btnContent}
        </button>
      </form>
    </div>
  );
}

export default ArticleForm;

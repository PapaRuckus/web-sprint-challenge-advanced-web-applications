import React, { useEffect, useState } from "react";
import PT from "prop-types";
import axios from "axios";

const initialFormValues = { title: "", text: "", topic: "" };

export default function ArticleForm(props) {
  const [values, setValues] = useState(initialFormValues);
  const { postArticle, updateArticle, setCurrentArticleId, currentArticleId } =
    props;

  useEffect(() => {
    if (currentArticleId) {
      setValues({
        title: currentArticleId.title,
        text: currentArticleId.text,
        topic: currentArticleId.topic,
      });
    } else {
      setValues(initialFormValues);
    }
  }, [currentArticleId]);

  const onSubmit = (evt) => {
    evt.preventDefault();

    const { text, title, topic } = values;

    postArticle({ text, title, topic });

    setValues(initialFormValues);
  };

  const onChange = (evt) => {
    const { id, value } = evt.target;
    setValues({ ...values, [id]: value });
  };

  const isDisabled = () => {
    // const trimTitle = values.title.trim();
    // const trimText = values.text.trim();

    // return !(
    //   trimTitle.length >= 1 &&
    //   trimText.length >= 1 &&
    //   values.topic !== ""
    // );
  };
  const onCancelEdit = () => {
    setCurrentArticleId(null);
    setValues({ title: "", text: "", topic: "" });
  };

  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
      <h2>{!currentArticleId ? "Create Article" : "Edit Article"}</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button type="submit " disabled={isDisabled()} id="submitArticle">
          Submit
        </button>
        {currentArticleId ? (
          <button type="button" onClick={onCancelEdit}>
            Cancel edit
          </button>
        ) : null}
      </div>
    </form>
  );
}

// 🔥 No touchy: LoginForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({
    // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  }),
};

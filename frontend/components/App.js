import React, { useState, useEffect } from "react";
import {
  NavLink,
  Routes,
  Route,
  useNavigate,
  BrowserRouter as Router,
} from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import PrivateRoutes from "./PrivateRoute";
import axios from "axios";
import { axiosWithAuth } from "../axios";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  const navigate = useNavigate();
  const redirectToLogin = () => navigate("/");
  const redirectToArticles = () => navigate("/articles");

  const logout = () => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
      setMessage("GoodBye!");
      redirectToLogin();
    }
  };

  const login = ({ username, password }) => {
    setMessage("");
    setSpinnerOn(true);
    axios
      .post(loginUrl, { username, password })
      .then((resp) => {
        setMessage(resp.data.message);
        localStorage.setItem("token", resp.data.token);
        redirectToArticles();
        setSpinnerOn(false);
      })
      .catch((err) => {
        console.log(err);
        setSpinnerOn(false);
      });
  };

  const getArticles = (message) => {
    setSpinnerOn(true);
    if (!message) {
      setMessage("");
    }
    axiosWithAuth()
      .get(articlesUrl)
      .then((resp) => {
        setArticles(resp.data.articles);
        if (!message) {
          setMessage(resp.data.message);
        }
        setSpinnerOn(false);
      })
      .catch((err) => {
        console.log(err);
        setSpinnerOn(false);
      });
  };

  const postArticle = (article) => {
    setSpinnerOn(true);
    axiosWithAuth()
      .post(articlesUrl, article)
      .then((resp) => {
        console.log("postArticle");
        setMessage(resp.data.message);
        articles.push(resp.data.article);
        setSpinnerOn(false);
      })
      .catch((err) => {
        console.log(err);
        setSpinnerOn(false);
      });
  };

  const updateArticle = ({ article_id, article }) => {
    axiosWithAuth()
      .put(`http://localhost:9000/api/articles/${article_id}`, article)
      .then((resp) => {
        console.log(resp.data);
        setMessage(resp.data.message);
        setCurrentArticleId(resp.data.article);
        getArticles(resp.data.message);
        setCurrentArticleId(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteArticle = (article_id) => {
    setSpinnerOn(true);
    axiosWithAuth()
      .delete(`http://localhost:9000/api/articles/${article_id}`)
      .then((resp) => {
        getArticles(resp.data.message);
        setMessage(resp.data.message);
        setSpinnerOn(false);
      })
      .catch((err) => {
        console.log(err);
        setSpinnerOn(false);
      });
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route element={<PrivateRoutes />}>
            <Route
              path="/articles"
              element={
                <>
                  <ArticleForm
                    updateArticle={updateArticle}
                    postArticle={postArticle}
                    setCurrentArticleId={setCurrentArticleId}
                    currentArticleId={currentArticleId}
                    getArticles={getArticles}
                  />
                  <Articles
                    deleteArticle={deleteArticle}
                    getArticles={getArticles}
                    articles={articles}
                    updateArticle={updateArticle}
                    setCurrentArticleId={setCurrentArticleId}
                    currentArticleId={currentArticleId}
                  />
                </>
              }
            />
          </Route>
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}

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
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState({});
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();
  const redirectToLogin = () => navigate("/");
  const redirectToArticles = () => navigate("/articles");

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
      setMessage("GoodBye!");
      redirectToLogin();
    }
  };

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
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

  // ✨ implement
  // We should flush the message state, turn on the spinner
  // and launch an authenticated request to the proper endpoint.
  // On success, we should set the articles in their proper state and
  // put the server success message in its proper state.
  // If something goes wrong, check the status of the response:
  // if it's a 401 the token might have gone bad, and we should redirect to login.
  // Don't forget to turn off the spinner!
  const getArticles = (message) => {
    setSpinnerOn(true);
    if (!message) {
      setMessage("")
    }
    axiosWithAuth()
      .get(articlesUrl)
      .then((resp) => {
        setArticles(resp.data.articles);
        setSpinnerOn(false);
        if (!message) {
          setMessage(resp.data.message)
        }
      })
      .catch((err) => {
        console.log(err);
        setSpinnerOn(false);
      });
  };
  
  const postArticle = (article) => {
    setSpinnerOn(true);
    console.log("hit it");
    axiosWithAuth()
      .post(articlesUrl, article)
      .then((resp) => {
        setMessage(resp.data.message);
        articles.push(resp.data.article)
        setSpinnerOn(false);
      })
      .catch((err) => {
        console.log(err);
        setSpinnerOn(false);
      });
  };

  const updateArticle = ({ article_id, article }) => {};

  let finalDelete = (article_id) => {
    setArticles((prev) => prev.filter((item) => item.id !== article_id));
  };
  const deleteArticle = (article_id) => {
    axiosWithAuth()
      .delete(`http://localhost:9000/api/articles/${article_id}`)
      .then((resp) => {
        getArticles(resp.data.message)
        setMessage(resp.data.message);
        
      })
      .catch((err) => {
        console.log("this is delete", err);
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
                  />
                  <Articles
                    deleteArticle={deleteArticle}
                    getArticles={getArticles}
                    articles={articles}
                    updateArticle={updateArticle}
                    setCurrentArticleId={setCurrentArticleId}
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

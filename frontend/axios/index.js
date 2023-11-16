import axios from "axios";

export const axiosWithAuth = () => {
  const token = localStorage.getItem("token");
  const articlesUrl = "http://localhost:9000/api/articles";

  return axios.create({
      baseURL: articlesUrl,
      headers: { authorization: token },
  });
};

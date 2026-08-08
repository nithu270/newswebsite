import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "../components/NewsCard";

const Category = () => {
  const { category } = useParams();
  const [news, setNews] = useState([]);
useEffect(() => {
  const fetchNews = async () => {
    try {
      const url =
        `https://newswebsite-cmtz.onrender.com/api/news` +
        `?category=${encodeURIComponent(category)}` +
        `&location=${encodeURIComponent(location)}`;

      console.log("Fetching news:", url);

      const { data } = await axios.get(url);

      setNews(data.articles || []);

    } catch (error) {
      console.error("News fetch error:", error);
      setNews([]);
    }
  };

  fetchNews();
}, [category, location]);
  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Category: {category}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {news.map((article, index) => (
          <NewsCard key={index} article={article} />
        ))}
      </div>
    </div>
  );
};

export default Category;

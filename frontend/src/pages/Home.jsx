import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FaVolumeUp, FaArrowLeft, FaArrowRight, FaTimes, FaRobot, FaBars, FaCaretDown, FaShareAlt } from "react-icons/fa";
import SearchBar from "../components/SearchBar";
import GoogleTranslateDropdown from "../components/GoogleTranslateDropdown";
import { Link } from "react-router-dom";
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});
const Home = () => {
  const [location, setLocation] = useState("Chennai");
  const [news, setNews] = useState([]);
  const [date, setDate] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("general");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [weather, setWeather] = useState(null);
  const [examDropdown, setExamDropdown] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loadingNews, setLoadingNews] = useState(true);
  console.log("test",darkMode)
const API_URL = "https://newswebsite-cmtz.onrender.com";

const fetchNews = async () => {
  try {
    let url =
      `${API_URL}/api/news` +
      `?category=${encodeURIComponent(category)}` +
      `&location=${encodeURIComponent(location)}`;

    if (query.trim()) {
      url =
        `${API_URL}/api/news` +
        `?query=${encodeURIComponent(query)}` +
        `&location=${encodeURIComponent(location)}`;
    }

    console.log("NEWS URL:", url);

    const response = await axios.get(url);

    setNews(response.data.articles || []);
  } catch (error) {
    console.error("NEWS ERROR:", error);
    setNews([]);
  }
};


const fetchWeather = async (latitude = null, longitude = null) => {
  try {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    let url;

    // User's actual location
    if (latitude !== null && longitude !== null) {
      url =
        `https://api.openweathermap.org/data/2.5/weather` +
        `?lat=${latitude}` +
        `&lon=${longitude}` +
        `&units=metric` +
        `&appid=${apiKey}`;
    }

    // Default location = Chennai
    else {
      url =
        `https://api.openweathermap.org/data/2.5/weather` +
        `?q=Chennai` +
        `&units=metric` +
        `&appid=${apiKey}`;
    }

    const { data } = await axios.get(url);

    console.log("Weather city:", data.name);

    setWeather({
      temp: data.main.temp,
      condition: data.weather[0].main,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
      city: data.name,
    });

setLocation((prev) =>
  prev === data.name ? prev : data.name
);

  } catch (error) {
    console.error("WEATHER ERROR:", error);
  }
};


const enableLocationWeather = () => {

  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(

    (position) => {

      const { latitude, longitude } = position.coords;

      fetchWeather(latitude, longitude);

    },

    (error) => {

      console.error("Location permission error:", error);

      alert("Location access denied. Showing Chennai news.");

      setLocation("Chennai");

      fetchWeather();
    }
  );
};


// Fetch news whenever location/category/search changes
useEffect(() => {
  fetchNews();
}, [date, query, category, location]);


// Fetch Chennai weather when page initially loads
useEffect(() => {
  fetchWeather();
}, []);

  const shareNews = (platform, title, url) => {
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);
    let shareLink = "";
    switch (platform) {
      case "whatsapp":
        shareLink = `https://api.whatsapp.com/send?text=${encodedTitle} - ${encodedUrl}`;
        break;
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "x":
        shareLink = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        break;
      default:
        return;
    }
    window.open(shareLink, "_blank");
  };
const handleSendMessage = async () => {
  if (!inputMessage.trim()) return;

  const userText = inputMessage;

  // Add user message
  setMessages((prev) => [
    ...prev,
    {
      text: userText,
      sender: "user",
    },
  ]);

  setInputMessage("");

  try {
    const response = await ai.models.generateContent({
     model: "gemini-3.6-flash",
      contents: userText,
    });

    console.log(response);

    const botReply =
      response.text ||
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    setMessages((prev) => [
      ...prev,
      {
        text: botReply,
        sender: "bot",
      },
    ]);
  } catch (error) {
    console.error("Gemini Error:", error);

    setMessages((prev) => [
      ...prev,
      {
        text: "⚠️ Error contacting Gemini API.",
        sender: "bot",
      },
    ]);
  }
};
  return (
    <motion.div className={`relative min-h-screen px-4 sm:px-6 lg:px-10 py-4 transition-all duration-500 overflow-x-hidden ${
  darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <nav className="fixed top-0 left-0 w-full h-16 bg-gray-800 text-white px-3 sm:px-6 z-50 shadow-lg flex items-center justify-between">
        <button onClick={() => setMenuOpen(true)} className="text-white text-3xl">
          <FaBars />
        </button>
        <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold font-serif tracking-wide flex items-center gap-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">The Digital Daily</span>
        </h2>

        <button onClick={() => setDarkMode(!darkMode)} className="text-3xl p-2 rounded-full shadow-md bg-gray-600 transition-all duration-300 hover:scale-110 mr-2 sm:mr-6">
          {darkMode ? <MdLightMode className="text-yellow-400" /> : <MdDarkMode className="text-gray-700" />}
        </button>
      </nav>


  <div className="pt-20 sm:pt-24">
      {/* Weather Section */}
<div className="flex justify-center md:justify-end mb-6">

  {weather && (
    <motion.div
      className={`w-full max-w-[220px] p-3 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 ${
        darkMode
          ? "bg-[#111827] text-white border border-gray-700"
          : "bg-white text-black border border-gray-200"
      }`}
    >
      <img
        src={weather.icon}
        alt={weather.condition}
        className="w-8 h-8"
      />

      <div className="text-sm flex-1">
        <p className="font-semibold">
          {weather.city}
        </p>

        <p>
          {Math.floor(weather.temp)}°C
        </p>
      </div>

    </motion.div>
  )}

  <button
    onClick={enableLocationWeather}
    className="ml-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm"
  >
    📍 My Location
  </button>

</div>
        {/* Header */}
        <motion.h1
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-10 drop-shadow-lg"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          📰 Trending News
        </motion.h1>
        {/* Translator */}
        <div className={`${darkMode ? "bg-[#111827] shadow shadow-white" : "bg-white shadow shadow-black"} flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 p-6 rounded-lg shadow-md`}>
        <div className="w-full w-full lg:w-1/4">
            <GoogleTranslateDropdown className="w-full p-4 border-2 rounded-lg bg-white dark:bg-gray-800 dark:text-white text-gray-700 font-semibold shadow-sm " />
          </div>
          <motion.div whileHover={{ scale: 1.05 }} className="w-full w-full lg:w-1/4 ">
            <select onChange={(e) => setCategory(e.target.value)} className="w-full p-4 border-2 rounded-lg bg-white dark:bg-gray-800 dark:text-white text-gray-700 font-semibold shadow-sm" value={category}>
              <option value="">Select Category</option>
              <option value="general">General</option>
              <option value="business">Business</option>
              <option value="entertainment">Entertainment</option>
              <option value="health">Health</option>
              <option value="science">Science</option>
              <option value="sports">Sports</option>
              <option value="technology">Technology</option>
            </select>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="w-full lg:w-2/4">
            <SearchBar setQuery={setQuery} className="w-full p-4 text-lg rounded-lg border-2 shadow-md" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="w-full lg:w-1/4 flex flex-col gap-2">
            <label className="text-gray-700 dark:text-gray-300 font-semibold">Pick a Date:</label>
            <input type="date" className="w-full p-3 border-2 rounded-lg shadow-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400" value={date} onChange={(e) => setDate(e.target.value)} />
          </motion.div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "tween", duration: 0.4 }} className="fixed top-0 left-0 w-[80%] sm:w-72 md:w-80 h-full bg-gray-800 text-white shadow-lg z-50 p-5">
              <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 text-white text-2xl">
                <FaTimes />
              </button>
              <h3 className="text-lg font-bold mb-4">Menu</h3>
              <ul className="space-y-4">
                <li className="relative">
                  <button onClick={() => setExamDropdown(!examDropdown)} className="w-full text-left p-2 flex items-center justify-between hover:bg-gray-700">
                    Exams <FaCaretDown />
                  </button>
                  {examDropdown && (
                    <ul className="ml-4 bg-gray-700 rounded-md overflow-hidden">
                      <li><Link to="/group1" className="block p-2 hover:bg-gray-600">TNPSC Group 1</Link></li>
                      <li><Link to="/group2" className="block p-2 hover:bg-gray-600">TNPSC Group 2</Link></li>
                      <li><Link to="/group3" className="block p-2 hover:bg-gray-600">TNPSC Group 3</Link></li>
                      <li><Link to="/group4" className="block p-2 hover:bg-gray-600">TNPSC Group 4</Link></li>
                      
                    </ul>
                  )}
                </li>
                <li><Link to="/quiz" className="block p-2 hover:bg-gray-700">Quiz game</Link></li>
                <li><Link to="/sudoku" className="block p-2 hover:bg-gray-700">Sudoku Game</Link></li>
                <li><Link to="/fact" className="block p-2 hover:bg-gray-700">Fact or Friction Game</Link></li>
                <li><Link to="/timeline" className="block p-2 hover:bg-gray-700">History Timeline Game</Link></li>
                <li>
                  <button onClick={() => { setChatOpen(!chatOpen); setMenuOpen(false); }} className="w-full text-left p-2 flex items-center hover:bg-gray-700">
                    Chatbot <FaRobot className="ml-2" />
                  </button>
                </li>
                
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div className="grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mt-10 ">
          { news.length > 0 ? (
            news.map((article, index) => ( 
              <div key={index} className="flex justify-center">
                <motion.div className={`${darkMode==true?"bg-[#111827] shadow shadow-white":"bg-white shadow shadow-black"} min-h-[430px]
flex flex-col
justify-between overflow-hidden dark:bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 w-full `}>
                  <img src={article.urlToImage || "https://via.placeholder.com/150"} alt="News" className="w-full h-52 sm:h-56 object-cover rounded-lg mb-4"/>
                  <div className="flex-1"> 
                    <h3 className={darkMode==true?"text-white text-lg font-semibold":"text-black text-lg font-semibold" }>{article.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{article.description || "No description available."}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">🗓 Published on: {new Date(article.publishedAt).toDateString()}</p>
                  </div>
                  <div className={`flex justify-between gap-2 flex-wrap items-center p-3 bottom-0 left-0 ${darkMode ? 'bg-[#111827] shadow-none' : 'bg-white  shadow-none' }`}
>

                    <button onClick={() => { const speech = new SpeechSynthesisUtterance(article.title); speech.lang = "en-US"; speech.rate = 0.85; speech.pitch = 1.1; window.speechSynthesis.speak(speech); }} className="p-2 rounded-full bg-gray-600 text-white text-lg hover:bg-gray-700 ">
                      <FaVolumeUp />
                    </button>
                    <button onClick={() => setSelectedIndex(index)} className="ml-2 p-2 rounded bg-gray-600 text-white hover:bg-gray-700 " >
                      Enlarge
                    </button>
                    <div className="relative ml-auto flex items-center">
                      <button className="flex items-center justify-end bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700" onClick={(e) => { const dropdown = e.currentTarget.nextSibling; dropdown.classList.toggle("hidden"); }}>
                        <FaShareAlt className="w-5 h-5" />
                      </button>
                      <div id="shareDropdown" className="absolute right-0 w-40 bg-white border rounded-md shadow-lg hidden z-50">
                        <button onClick={() => shareNews("whatsapp", article.title, article.url)} className="block w-full text-left px-4 py-2 text-black-600 hover:bg-gray-300">WhatsApp</button>
                        <button onClick={() => shareNews("facebook", article.title, article.url)} className="block w-full text-left px-4 py-2 text-black-600 hover:bg-gray-300">Facebook</button>
                        <button onClick={() => shareNews("x", article.title, article.url)} className="block w-full text-left px-4 py-2 text-black-600 hover:bg-gray-300">X</button>
                        <hr className="border-gray-300" />
                        <button onClick={(e) => { e.stopPropagation(); e.currentTarget.closest(".relative").querySelector(".absolute").classList.add("hidden"); }} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-300">❌ Close</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-lg dark:text-gray-300">Loading ...</p>
          )}
        </motion.div>
      </div>
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedIndex(null)}>
<motion.div
  className={`${darkMode ? "bg-gray-900 shadow-white" : "bg-white shadow-black"} relative p-4 sm:p-6 lg:p-8 w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] max-w-3xl h-[90vh] overflow-y-auto newspaper-format shadow-xl`}
  initial={{ scale: 0.8 }}
  animate={{ scale: 1 }}
  exit={{ scale: 0.8 }}
  onClick={(e) => e.stopPropagation()}>
              <button className="absolute top-4 right-4 text-2xl text-red-600" onClick={() => setSelectedIndex(null)}>
                <FaTimes />
              </button>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center uppercase underline mb-4">{news[selectedIndex]?.title}</h1>
              <h3 className="text-center italic text-gray-500">Published on {new Date(news[selectedIndex]?.publishedAt).toDateString()}</h3>
              <img src={news[selectedIndex]?.urlToImage || "https://via.placeholder.com/600"} alt="News" className="w-full h-60 object-cover my-5 rounded-lg shadow-md" />
              <p className="text-justify text-lg leading-relaxed">{news[selectedIndex]?.content || "Full article content not available."}</p>
              <p className="text-right mt-5 italic text-gray-600 ">
                <a href={news[selectedIndex]?.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Read full article →
                </a>
              </p>
              <button className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700" onClick={() => setSelectedIndex((prev) => (prev > 0 ? prev - 1 : news.length - 1))}>
                <FaArrowLeft />
              </button>
              <button className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700" onClick={() => setSelectedIndex((prev) => (prev < news.length - 1 ? prev + 1 : 0))}>
                <FaArrowRight />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {chatOpen && (
        <motion.div
  className="fixed bottom-0 left-0 w-full h-[75vh] sm:h-[70vh] lg:h-[500px] bg-white text-black shadow-2xl z-50 p-3 sm:p-4 flex flex-col"
>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Chatbot</h3>
              <button onClick={() => setChatOpen(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto space-y-3">
              {messages.map((message, index) => (
              <div
className={`p-3 rounded-lg ${
message.sender === "user"
? "bg-blue-100 text-black text-right"
: "bg-gray-100 text-black"
}`}
>
                  {message.text}
                </div>
              ))}
            </div>
            <div className="flex mt-4">
              <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Type a message..." className="flex-grow p-3 border border-gray-300 rounded-l-md bg-white text-black focus:outline-none" />
              <button onClick={handleSendMessage} className="p-2 bg-gray-600 text-white rounded-r-md hover:bg-gray-700">
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Home;
import { useState } from "react";

const SearchBar = ({ setQuery }) => {
  const [search, setSearch] = useState("");
  const [listening, setListening] = useState(false);

  // Normal search
  const handleSearch = (e) => {
    e.preventDefault();

    const value = search.trim();

    if (!value) return;

    // This will trigger fetchNews() in Home.jsx
    setQuery(value);
  };

  // Voice search
  const handleVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice search is not supported in this browser. Please use Google Chrome."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("Voice search started");
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript.trim();

      console.log("Voice search:", transcript);

      if (transcript) {
        setSearch(transcript);

        // Trigger news search without changing route
        setQuery(transcript);
      }
    };

    recognition.onend = () => {
      console.log("Voice search ended");
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Voice search error:", event.error);
      setListening(false);

      if (event.error === "not-allowed") {
        alert(
          "Microphone permission was denied. Please allow microphone access."
        );
      }
    };

    recognition.start();
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full flex items-center"
    >
      <input
        type="text"
        placeholder="Search news..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          flex-1
          min-w-0
          p-3
          border
          border-gray-300
          rounded-l-lg
          bg-white
          text-gray-800
          dark:bg-gray-800
          dark:text-white
          dark:border-gray-600
          focus:outline-none
          focus:ring-2
          focus:ring-gray-400
        "
      />

      <button
        type="submit"
        className="
          px-4
          py-3
          bg-gray-600
          hover:bg-gray-700
          text-white
          font-semibold
          transition
        "
      >
        Search
      </button>

      <button
        type="button"
        onClick={handleVoiceSearch}
        className={`
          ml-2
          p-3
          rounded-full
          text-white
          transition-all
          duration-200
          ${
            listening
              ? "bg-red-600 animate-pulse"
              : "bg-gray-600 hover:bg-gray-700"
          }
        `}
        title={listening ? "Listening..." : "Voice Search"}
      >
        {listening ? "🔴" : "🎤"}
      </button>
    </form>
  );
};

export default SearchBar;
import { useState, useEffect, useRef } from "react";
import { fetchData } from "../../firebase"; // Ensure fetchData is correctly imported

const FireAlertWidget = () => {
  const [fireDetected, setFireDetected] = useState(false);
  const [muted, setMuted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const alertSoundRef = useRef(null);

  useEffect(() => {
    alertSoundRef.current = new Audio("/fire-alert.mp3");
    alertSoundRef.current.loop = true;

    // Unlock audio playback after user clicks or touches the screen
    const enableAudio = () => {
      setAudioEnabled(true);

      // Attempt to play a silent sound to unlock autoplay
      alertSoundRef.current
        .play()
        .then(() => {
          console.log("Audio autoplay unlocked.");
          alertSoundRef.current.pause();
          alertSoundRef.current.currentTime = 0;
        })
        .catch((error) => console.warn("Autoplay unlock failed:", error));

      document.removeEventListener("click", enableAudio);
      document.removeEventListener("touchstart", enableAudio);
    };

    document.addEventListener("click", enableAudio);
    document.addEventListener("touchstart", enableAudio);

    return () => {
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("touchstart", enableAudio);
    };
  }, []);

  // Function to play sound
  const playSound = () => {
    if (audioEnabled && alertSoundRef.current && !muted) {
      alertSoundRef.current.play().catch((error) => {
        console.warn("Audio play error:", error);
      });
    }
  };

  useEffect(() => {
    if (!audioEnabled) return;

    const handleFireStatus = (data) => {
      console.log("Fire status updated:", data);

      if (data === "🔥 Fire Detected!") {
        if (!fireDetected) {
          setFireDetected(true);
          playSound();
        }
      } else {
        setFireDetected(false);
        if (alertSoundRef.current) {
          alertSoundRef.current.pause();
          alertSoundRef.current.currentTime = 0;
        }
      }
    };

    if (typeof fetchData === "function") {
      const unsubscribe = fetchData("/fireStatus", handleFireStatus);

      return () => {
        unsubscribe?.();
        if (alertSoundRef.current) {
          alertSoundRef.current.pause();
          alertSoundRef.current.currentTime = 0;
        }
      };
    } else {
      console.error("fetchData is not a function. Check your import.");
    }
  }, [fireDetected, muted, audioEnabled]);

  return (
    <div
      className={`p-4 rounded-md text-center flex flex-col items-center justify-center w-full h-full transition-all duration-500 ${
        fireDetected ? "bg-red-500 text-white" : "bg-white text-black"
      }`}
    >
      <h2 className="font-bold text-xl">🔥 Fire Alert</h2>

      {/* Blinking Light only when fire is detected */}
      <div
        className={`w-12 h-12 rounded-full mx-auto mt-4 ${
          fireDetected ? "animate-ping bg-red-700" : "bg-green-500"
        }`}
      ></div>

      {/* Mute/Unmute Button */}
      <button
        onClick={() => setMuted(!muted)}
        className="mt-4 px-4 py-2 rounded-md bg-gray-800 text-white"
      >
        {muted ? "Unmute 🔊" : "Mute 🔇"}
      </button>
    </div>
  );
};

export default FireAlertWidget;

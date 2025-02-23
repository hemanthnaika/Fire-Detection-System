import { useState, useEffect, useRef } from "react";
import { fetchData } from "../../firebase"; // Ensure fetchData is a valid function

const FireAlertWidget = () => {
  const [fireDetected, setFireDetected] = useState(false);
  const [muted, setMuted] = useState(false);
  const alertSoundRef = useRef(null);

  useEffect(() => {
    // Ensure we create the audio instance once
    if (!alertSoundRef.current) {
      alertSoundRef.current = new Audio("/fire-alert.mp3");
      alertSoundRef.current.loop = true;
    }
    const alertSound = alertSoundRef.current;

    // Function to handle fire status updates
    const handleFireStatus = (data) => {
      console.log("Fire status updated:", data); // Debugging log

      if (data === "🔥 Fire Detected!") {
        if (!fireDetected) {
          setFireDetected(true);
          if (!muted) {
            alertSound
              .play()
              .catch((error) => console.warn("Autoplay prevented:", error));
          }
        }
      } else {
        setFireDetected(false);
        alertSound.pause();
        alertSound.currentTime = 0; // Reset audio
      }
    };

    // Ensure fetchData is a function before calling it
    if (typeof fetchData === "function") {
      const unsubscribe = fetchData("/fireStatus", handleFireStatus);
      
      return () => {
        // Cleanup function: stop sound and remove listener
        unsubscribe?.();
        alertSound.pause();
        alertSound.currentTime = 0;
      };
    } else {
      console.error("fetchData is not a function. Check your import.");
    }
  }, [fireDetected, muted]);

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

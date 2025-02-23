import { useState, useEffect, useRef } from "react";
import { fetchData } from "../../firebase"; // Import fetch function

const FireAlertWidget = () => {
  const [fireDetected, setFireDetected] = useState(false);
  const [muted, setMuted] = useState(false);
  const alertSoundRef = useRef(new Audio("/fire-alert.mp3")); // Persist Audio Instance

  useEffect(() => {
    const alertSound = alertSoundRef.current;
    alertSound.loop = true; // Ensure looping until fire is gone

    const handleFireStatus = (data) => {
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

    const unsubscribe = fetchData("/fireStatus", handleFireStatus);

    return () => {
      unsubscribe(); // Cleanup listener if `fetchData` supports it
      alertSound.pause();
      alertSound.currentTime = 0;
    };
  }, [fireDetected, muted]); // Depend on `fireDetected` & `muted`

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

import { useState, useEffect } from "react";
import { fetchData } from "../../firebase"; // Import fetch function

const FireAlertWidget = () => {
  const [fireDetected, setFireDetected] = useState(false);
  const [muted, setMuted] = useState(false);
  const alertSound = new Audio("/fire-alert.mp3"); // Load sound file

  useEffect(() => {
    fetchData("/fireStatus", (data) => {
      if (data === "🔥 Fire Detected!") {
        if (!fireDetected) {
          alertSound.play(); // Play sound only when fire is detected
          setFireDetected(true);
        }
      } else {
        setFireDetected(false);
        alertSound.pause();
        alertSound.currentTime = 0; // Reset sound when fire is gone
      }
    });
  }, []); // Fetch data only once

  return (
    <div
      className={`p-4  rounded-md text-center flex  flex-col items-center justify-center w-full h-full transition-all duration-500 ${
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
    </div>
  );
};

export default FireAlertWidget;

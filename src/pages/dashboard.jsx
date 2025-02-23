// Dashboard.jsx
import { useState, useEffect } from "react";
import { fetchData } from "../../firebase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import moment from "moment";
import FireAlertWidget from "../components/FireAlertWidget";
import MapComponent from "../components/map"; // Update import for the MapComponent

const Dashboard = () => {
  const [fireStatus, setFireStatus] = useState("");
  const [gpsLocation, setGpsLocation] = useState({ latitude: 0, longitude: 0 });
  const [temperature, setTemperature] = useState([]);
  const [humidity, setHumidity] = useState([]);
  const [gasLevel, setGasLevel] = useState([]);
  const [map, setMap] = useState(false);
  useEffect(() => {
    // Fetch Fire Status
    fetchData("/fireStatus", (data) => setFireStatus(data));

    fetchData("/fireStatus", (data) => {
      if (data === "🔥 Fire Detected!") {
        setMap(true);
      } else {
        setMap(false);
      }
    });
    // Fetch GPS Location
    fetchData("/gps", (data) => {
      setGpsLocation({
        latitude: data.latitude,
        longitude: data.longitude,
      });
    });

    // Fetch Sensor Data (Temperature, Humidity, Gas)
    fetchData("/temperature", (data) =>
      setTemperature((prev) => [...prev, { time: Date.now(), temp: data }])
    );
    fetchData("/humidity", (data) =>
      setHumidity((prev) => [...prev, { time: Date.now(), humidity: data }])
    );
    fetchData("/gasLevel", (data) =>
      setGasLevel((prev) => [...prev, { time: Date.now(), gas: data }])
    );
  }, []);

  // Ensure the temperature is within the 0-100°C range
  const currentTemperature =
    temperature.length > 0 ? temperature[temperature.length - 1].temp : 0;
  const normalizedTemperature = Math.min(100, Math.max(0, currentTemperature)); // Ensure it’s between 0 and 100

  // Define colors for temperature based on its value
  const getTempFillColor = (value) => {
    if (value <= 30) return "#00C49F"; // Green for normal
    if (value <= 70) return "#FFBB28"; // Yellow for medium
    return "#FF8042"; // Red for high
  };

  // Define colors for humidity based on its value
  const getHumidityFillColor = (value) => {
    if (value <= 40) return "#00C49F"; // Green for normal
    if (value <= 70) return "#FFBB28"; // Yellow for medium
    return "#FF8042"; // Red for high
  };

  // Temperature data for Pie Chart
  const temperatureData = [
    { name: "Temperature", value: normalizedTemperature },
    { name: "Remaining", value: 100 - normalizedTemperature },
  ];

  // Humidity data for Pie Chart
  const currentHumidity =
    humidity.length > 0 ? humidity[humidity.length - 1].humidity : 0;
  const normalizedHumidity = Math.min(100, Math.max(0, currentHumidity)); // Ensure it’s between 0 and 100

  const humidityData = [
    { name: "Humidity", value: normalizedHumidity },
    { name: "Remaining", value: 100 - normalizedHumidity },
  ];
  const formattedDate = moment().format("MM/DD/YYYY");

  return (
    <section className="mt-10">
      <h1 className="text-white font-par font-bold text-2xl">
        Forest Fire Detection Dashboard
      </h1>
      <div className="flex justify-between mt-4">
        <div className="bg-white opacity-70 font-par text-xl font-bold p-4 border rounded-md ">
          <h2>Fire Status: {fireStatus}</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6 gap-1 mt-5 mb-5">
        {/* Temperature Pie Chart */}
        <div className="bg-white p-4 border rounded-md">
          <h2 className="font-bold font-heading text-xl">Temperature (°C)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={temperatureData}
                cx="50%" // Centers the pie chart
                cy="50%"
                startAngle={180} // Start angle of 180 degrees
                endAngle={0} // End angle at 0 degrees
                innerRadius={60} // Inner radius for the donut effect
                outerRadius={80} // Outer radius for the donut effect
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {temperatureData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getTempFillColor(entry.value)} // Conditional color based on value
                  />
                ))}
              </Pie>
              {/* Display the temperature value in the center of the pie chart */}
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#000"
                fontSize={20}
              >
                {`${normalizedTemperature}°C`} {/* Display temperature in °C */}
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Humidity Pie Chart */}
        <div className="bg-white p-4 border rounded-md">
          <h2 className="font-bold font-heading text-xl">Humidity (%)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={humidityData}
                cx="50%" // Centers the pie chart
                cy="50%"
                startAngle={180} // Start angle of 180 degrees
                endAngle={0} // End angle at 0 degrees
                innerRadius={60} // Inner radius for the donut effect
                outerRadius={80} // Outer radius for the donut effect
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {humidityData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getHumidityFillColor(entry.value)} // Conditional color based on value
                  />
                ))}
              </Pie>
              {/* Display the humidity value in the center of the pie chart */}
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#000"
                fontSize={20}
              >
                {`${normalizedHumidity}%`}{" "}
                {/* Display humidity in percentage */}
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Fire Alert Widget */}
        <div className="bg-white p-4 border rounded-md">
          <FireAlertWidget />
        </div>

        {/* Gas Sensor Value */}
        <div className="bg-white border rounded-md p-4 md:col-span-3">
          <h2 className="font-bold font-heading text-xl">Gas Sensor Value</h2>
          {/* Display Current Gas Level */}
          <div className="flex items-center justify-center gap-5 mb-5">
            <p className="text-md text-gray-500 ">{`Date: ${formattedDate}`}</p>
            {gasLevel.length > 0 ? (
              <p>
                {`Current Gas Level: ${
                  gasLevel[gasLevel.length - 1].gas
                } (at ${moment(gasLevel[gasLevel.length - 1].time).format(
                  "hh:mm A"
                )})`}
              </p>
            ) : (
              <p>No gas level data available.</p>
            )}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={gasLevel}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tickFormatter={(timeStr) => moment(timeStr).format("hh:mm A")}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="gas" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* If map send then dispal  */}
      {map && (
        <div className="bg-white p-4 border rounded-md">
          <h2 className="font-bold font-heading text-xl">Fire Location</h2>
          <MapComponent
            latitude={gpsLocation.latitude}
            longitude={gpsLocation.longitude}
          />
        </div>
      )}
    </section>
  );
};

export default Dashboard;

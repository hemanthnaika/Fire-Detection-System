// src/components/Dashboard.js
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
} from "recharts";

function Dashboard() {
  const [fireStatus, setFireStatus] = useState("");
  const [gpsLocation, setGpsLocation] = useState({ latitude: 0, longitude: 0 });
  const [temperature, setTemperature] = useState([]);
  const [humidity, setHumidity] = useState([]);
  const [gasLevel, setGasLevel] = useState([]);

  useEffect(() => {
    // Fetch Fire Status
    fetchData("/fireStatus", (data) => setFireStatus(data));

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

  return (
    <div className="max-w-screen-lg mx-auto p-6  shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">
        Fire Detection System Dashboard
      </h1>
      <div className="flex justify-between mb-4">
        <div className="w-1/2 p-4 border rounded-md">
          <h2 className="font-semibold">Fire Status: {fireStatus}</h2>
          <p>Latitude: {gpsLocation.latitude}</p>
          <p>Longitude: {gpsLocation.longitude}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-1 p-4 border rounded-md">
          <h2 className="font-semibold">Temperature (°C)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={temperature}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temp" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-1 p-4 border rounded-md">
          <h2 className="font-semibold">Humidity (%)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={humidity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 p-4 border rounded-md"> 
        <h2 className="font-semibold">Gas Level</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={gasLevel}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="gas" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;

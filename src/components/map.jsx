import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const MapComponent = ({ latitude, longitude }) => {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={2}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]}>
        <Popup>
          {(latitude, longitude)} <br />
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;

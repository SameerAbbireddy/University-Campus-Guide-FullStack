import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";

function LocationMarker() {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    map.locate();

    map.on("locationfound", (e) => {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 16);
    });
  }, [map]);

  return position ? (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  ) : null;
}

function MapView({ places, setSelected }) {
  return (
    <MapContainer
      center={[16.5062, 80.6480]}
      zoom={14}
      className="h-screen w-screen"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User location */}
      <LocationMarker />

      {/* Places */}
      {places.map((place) => (
        place.lat && place.lng && (
          <Marker
            key={place._id}
            position={[place.lat, place.lng]}
            eventHandlers={{
              click: () => setSelected(place),
            }}
          >
            <Popup>{place.name}</Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
}

export default MapView;
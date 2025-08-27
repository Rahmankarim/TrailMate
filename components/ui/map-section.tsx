import React from "react";

interface MapSectionProps {
  location: string;
}

const MapSection: React.FC<MapSectionProps> = ({ location }) => {
  // For demo, use Google Maps embed with location string
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
  return (
    <div className="rounded-xl overflow-hidden shadow-lg w-full h-80">
      <iframe
        title="Map"
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full"
      ></iframe>
    </div>
  );
};

export default MapSection;

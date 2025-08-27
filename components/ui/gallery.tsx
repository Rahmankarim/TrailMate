import React from "react";

interface GalleryProps {
  images: string[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 rounded-xl overflow-hidden shadow-lg">
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`Gallery image ${idx + 1}`}
          className="w-full h-40 object-cover object-center rounded-lg border"
        />
      ))}
    </div>
  );
};

export default Gallery;

import React, { useState } from 'react';

function ImageUploader({image, setImage}) {

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />
      {image && (
        <img
          src={image}
          alt="Preview"
          className="w-64 h-auto rounded shadow"
        />
      )}
    </div>
  );
}

export default ImageUploader;

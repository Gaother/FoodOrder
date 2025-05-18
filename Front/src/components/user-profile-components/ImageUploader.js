import React, { useState } from 'react';

function ImageUploader({image, setImage}) {
  const [imageToShow, setImageToShow] = useState(image);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      loadImage(file);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result); // retourne une URL base64
      reader.onerror = reject;
    });

  const loadImage = async (file) => {
    const base64String = await toBase64(file);
    setImageToShow(base64String);
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />
      {imageToShow && (
        <img
          src={imageToShow}
          alt="Preview"
          className="w-64 h-auto rounded shadow"
        />
      )}
    </div>
  );
}

export default ImageUploader;

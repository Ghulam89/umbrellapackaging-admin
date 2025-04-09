import React, { useState } from 'react';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const handleInputChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setIsActive(true);
    showFile(selectedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsActive(true);
  };

  const handleDragLeave = () => {
    setIsActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const selectedFile = event.dataTransfer.files[0];
    setFile(selectedFile);
    setIsActive(true);
    showFile(selectedFile);
  };

  const showFile = (file) => {
    const fileType = file.type;
    const validExtensions = ["image/jpeg", "image/jpg", "image/png"];
  
    if (validExtensions.includes(fileType)) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const fileURL = fileReader.result;
        setFile(<img src={fileURL} alt="image" />);
      };
      fileReader.readAsDataURL(file);
    } else {
      alert("This is not an Image File!");
      setIsActive(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-500">
      <div
        className={`border-2 border-white rounded-lg p-8 ${
          isActive ? 'border-dashed' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-5xl text-white mb-4">
          <i className="fas fa-cloud-upload-alt"></i>
        </div>
        <header className="text-2xl font-semibold text-white mb-2">
          Drag & Drop to Upload File
        </header>
        <span className="text-xl font-semibold text-white mb-4">OR</span>
        <label
          htmlFor="fileInput"
          className="px-4 py-2 bg-white text-blue-500 rounded-lg cursor-pointer"
        >
          Browse File
        </label>
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
      <div className="ml-8">{file}</div>
    </div>
  );
};

export default FileUpload;
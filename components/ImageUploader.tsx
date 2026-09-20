import React, { useRef } from 'react';
import { UploadIcon, TrashIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imagePreview: string | null;
  onReset: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imagePreview, onReset }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  if (imagePreview) {
    return (
      <div className="text-center">
        <p className="text-lg font-semibold text-neutral-700 mb-2">Image Preview:</p>
        <div className="relative inline-block">
          <img src={imagePreview} alt="Preview" className="max-h-80 rounded-lg shadow-md" />
          <button onClick={onReset} className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-transform transform hover:scale-110">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={triggerFileInput}
      className="mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-md cursor-pointer hover:border-green-500 bg-neutral-50 transition-colors"
    >
      <div className="space-y-1 text-center">
        <UploadIcon className="mx-auto h-12 w-12 text-neutral-400" />
        <div className="flex text-sm text-neutral-600">
          <p className="relative bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
            <span>Upload a file</span>
            <input ref={inputRef} type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
          </p>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-neutral-500">PNG, JPG, GIF up to 10MB</p>
      </div>
    </div>
  );
};

export default ImageUploader;

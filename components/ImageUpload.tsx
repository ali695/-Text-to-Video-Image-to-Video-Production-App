import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (base64: string) => void;
  selectedImage: string | null;
  onClear: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, selectedImage, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      // Check size (limit 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File is too large. Max 10MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImageSelect(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  if (selectedImage) {
    return (
      <div className="relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden group border border-white/10 bg-black/20">
        <img 
          src={selectedImage} 
          alt="Preview" 
          className="w-full h-full object-contain" 
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            onClick={onClear}
            className="bg-red-500/80 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-red-600 transition-colors backdrop-blur-sm"
          >
            <X size={18} /> Remove Image
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`
        w-full h-full min-h-[400px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-8 transition-all
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-500/10 scale-[0.99]' 
          : 'border-zinc-700 hover:border-zinc-500 bg-white/5'
        }
      `}
    >
      <input
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        id="file-upload"
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
      />
      <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
        <Upload className="text-zinc-400" size={32} />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Upload an Image</h3>
      <p className="text-zinc-400 mb-6 max-w-xs">
        Drag and drop or click to browse. 
        <br /><span className="text-xs opacity-60">JPG, PNG, WebP (Max 10MB)</span>
      </p>
      <label 
        htmlFor="file-upload" 
        className="cursor-pointer bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-zinc-200 transition-colors"
      >
        Choose File
      </label>
    </div>
  );
};

export default ImageUpload;
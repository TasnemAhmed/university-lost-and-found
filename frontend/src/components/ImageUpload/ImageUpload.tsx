import React, { useState, useRef } from 'react';
import { Upload, X, RefreshCw, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string | null;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const ImageUpload: React.FC<ImageUploadProps> = ({ file, onChange, error }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (selectedFile: File) => {
    setLocalError(null);

    // Validate type
    if (!ALLOWED_TYPES.includes(selectedFile.type.toLowerCase())) {
      setLocalError('Invalid file type. Only JPG, PNG, and WEBP are supported.');
      return;
    }

    // Validate size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setLocalError('File size exceeds 5 MB. Please choose a smaller image.');
      return;
    }

    // Generate local preview URL
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    onChange(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      validateAndSetFile(selected);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      validateAndSetFile(dropped);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setLocalError(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTriggerSelect = () => {
    fileInputRef.current?.click();
  };

  const activeError = localError || error;

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {previewUrl ? (
        // Preview State
        <div className="relative rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-50 p-2">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden bg-slate-900">
            <img
              src={previewUrl}
              alt="Uploaded item preview"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex items-center justify-between pt-3 px-2">
            <div className="flex items-center gap-2 text-xs text-slate-600 truncate max-w-[200px] sm:max-w-xs">
              <ImageIcon className="w-4 h-4 text-navy-600 shrink-0" />
              <span className="truncate font-medium">{file?.name}</span>
              <span className="text-slate-400">
                ({file ? (file.size / (1024 * 1024)).toFixed(2) : 0} MB)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTriggerSelect}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Replace</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Empty Upload Dropzone
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleTriggerSelect}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
            activeError
              ? 'border-rose-300 bg-rose-50/40 hover:bg-rose-50/70'
              : 'border-slate-300 bg-slate-50/60 hover:bg-slate-100/80 hover:border-navy-500'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-navy-800 mx-auto flex items-center justify-center mb-3 shadow-xs">
            <Upload className="w-6 h-6 stroke-[1.5]" />
          </div>

          <p className="text-sm font-semibold text-slate-800">
            Click to upload an image, or drag and drop here
          </p>
          <p className="text-xs text-slate-500 mt-1">
            JPG, PNG, or WEBP up to 5 MB (Optional, but recommended)
          </p>
        </div>
      )}

      {activeError && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium pt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{activeError}</span>
        </div>
      )}
    </div>
  );
};

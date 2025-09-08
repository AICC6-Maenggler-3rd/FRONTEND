import { useState } from 'react';

interface FileUploadProps {
  onUpload: (file: File) => void;
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (file) {
      onUpload(file);
      setFile(null);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleSubmit}
        className="px-3 py-1 bg-blue-600 text-white rounded"
        disabled={!file}
      >
        업로드
      </button>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { useState } from 'react';
import FileUpload from '../components/common/FileUpload';
import { uploadPDF } from '../api/upload';
import { useFileStore } from '../store/fileStore';

export default function Home() {
  const [message, setMessage] = useState('');
  const addFile = useFileStore((state) => state.addFile);

  const handleUpload = async (file: File) => {
    try {
      const res = await uploadPDF(file);
      addFile(res);
      setMessage(`✅ 업로드 성공: ${res.filename}`);
    } catch (err) {
      console.error(err);
      setMessage('❌ 업로드 실패');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      <h1 className="text-2xl font-bold">문제 업로드 플랫폼</h1>
      <FileUpload onUpload={handleUpload} />
      {message && <p>{message}</p>}
      <Link
        to="/problems"
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        문제 풀러 가기
      </Link>
    </div>
  );
}

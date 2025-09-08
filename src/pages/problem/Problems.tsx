import { useFileStore } from '../../store/fileStore';
import type { Problem } from '../../types/problem';
import { useState } from 'react';

// ⚠️ 지금은 더미 데이터 (백엔드 연동 전)
// 나중에는 FastAPI에서 파일 ID 기반 문제 리스트 가져오기 API 필요
const dummyProblems: Problem[] = [
  {
    id: '1',
    question: '2 + 2 = ?',
    choices: ['2', '3', '4', '5'],
    answer: '4',
    category: '수학/기초',
  },
  {
    id: '2',
    question: '삼각형의 내각의 합은?',
    choices: ['90°', '120°', '180°', '360°'],
    answer: '180°',
    category: '수학/기하',
  },
];

export default function Problems() {
  const files = useFileStore((state) => state.files);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const currentProblem = dummyProblems[currentIndex];

  const handleSubmit = () => {
    if (selected === currentProblem.answer) {
      setScore((prev) => prev + 1);
    }
    setSelected(null);
    setCurrentIndex((prev) => prev + 1);
  };

  if (currentIndex >= dummyProblems.length) {
    return (
      <div className="flex flex-col items-center gap-4 mt-10">
        <h1 className="text-2xl font-bold">문제 풀이 완료 🎉</h1>
        <p>
          최종 점수: {score} / {dummyProblems.length}
        </p>
        <h2 className="text-lg">업로드한 파일들</h2>
        <ul className="list-disc">
          {files.map((f) => (
            <li key={f.file_id}>{f.filename}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 mt-10">
      <h1 className="text-xl font-bold">문제 {currentIndex + 1}</h1>
      <p>{currentProblem.question}</p>
      <div className="flex flex-col gap-2">
        {currentProblem.choices.map((choice) => (
          <button
            key={choice}
            onClick={() => setSelected(choice)}
            className={`px-4 py-2 rounded border ${
              selected === choice ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            {choice}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-green-500 text-white rounded"
        disabled={!selected}
      >
        제출
      </button>
    </div>
  );
}

export interface Problem {
  id: string;
  question: string;
  choices: string[];
  answer: string;
  category: string; // 예: "수학/확률"
}

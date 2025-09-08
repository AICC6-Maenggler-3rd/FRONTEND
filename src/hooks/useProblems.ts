import { useEffect, useState } from "react";
import axios from "axios";
import type { Problem } from "../types/problem";

export function useProblems(fileId: string) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get<Problem[]>(
          `http://localhost:8000/problems/${fileId}`
        );
        setProblems(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, [fileId]);

  return { problems, loading };
}

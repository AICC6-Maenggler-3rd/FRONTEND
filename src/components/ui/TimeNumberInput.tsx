import React, {
  useState,
  useCallback,
  useMemo,
  type ChangeEvent,
  type FocusEvent,
} from 'react';

// 타입 정의
type TimeString = string; // 최종 결과 형식: "HH:MM"
type Hour = string; // 00 ~ 23
type Minute = string; // 00 ~ 59

interface TimeNumberInputProps {
  initialTime?: TimeString;
  onChange?: (time: TimeString) => void;
}

// 헬퍼 함수: 분 옵션 생성
const createMinuteOptions = (): Minute[] => {
  return Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
};

const TimeNumberInput: React.FC<TimeNumberInputProps> = ({
  initialTime = '00:00',
  onChange,
}) => {
  // 초기값 파싱 (예: "09:30" -> ["09", "30"])
  const [initialHour, initialMinute] = initialTime
    .split(':')
    .map((val) => val.padStart(2, '0'));

  // 컴포넌트 내부 상태
  const [hour, setHour] = useState<Hour>(initialHour);
  const [minute, setMinute] = useState<Minute>(initialMinute);

  // 분(Minute) 선택 옵션 (useMemo로 렌더링 시마다 재생성 방지)
  const minuteOptions = useMemo(createMinuteOptions, []);

  // --- Hour Input Handlers (숫자 입력) ---

  // 1. 입력 값 변경 시: 내부 상태만 업데이트 (잦은 부모 렌더링 방지)
  const handleHourChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const num = parseInt(value, 10);

    // 유효성 검사 (0-23 범위 확인)
    if (isNaN(num) || num < 0 || num > 23) {
      if (value === '') {
        setHour(''); // 완전히 비워진 상태 허용
        return;
      }
      // 유효하지 않은 입력은 무시하고 이전 상태 유지
      return;
    }

    // 2자리로 포맷팅 (예: 5 -> 05)
    // 입력 중에는 포맷팅하지 않고, onBlur에서 최종 포맷팅하는 것이 사용자 경험에 더 좋습니다.
    setHour(value);
  }, []);

  // 2. 포커스 아웃 시: 최종 포맷팅 및 부모에게 전달
  const handleHourBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const num = parseInt(value, 10);

      let finalHour: Hour;

      if (isNaN(num) || num < 0 || num > 23) {
        finalHour = '00'; // 유효하지 않으면 00으로 리셋
      } else {
        finalHour = String(num).padStart(2, '0'); // 유효하면 2자리 포맷
      }

      setHour(finalHour);

      // 최종 시간 조합 및 부모 컴포넌트의 onChange 호출
      const finalTime = `${finalHour}:${minute}`;
      if (onChange) {
        onChange(finalTime);
      }
    },
    [minute, onChange],
  );

  // --- Minute Select Handlers (드롭다운 선택) ---

  // 선택 값 변경 시: 내부 상태 업데이트 및 부모에게 전달
  const handleMinuteChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const newMinute = e.target.value;
      setMinute(newMinute);

      // Select는 항상 유효한 값을 선택하므로 바로 부모에게 전달
      const finalTime = `${hour.padStart(2, '0')}:${newMinute}`;
      if (onChange) {
        onChange(finalTime);
      }
    },
    [hour, onChange],
  );

  return (
    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
      {/* 1. 시간 입력 (Input Number) */}
      <input
        type="number"
        value={hour}
        onChange={handleHourChange} // 입력 시 내부 상태만 변경
        onBlur={handleHourBlur} // 포커스 아웃 시 유효성 검사 및 최종 값 전달
        min="0"
        max="23"
        placeholder="HH"
        maxLength={2} // 시각적인 2자리 제한
        style={{ width: '40px', textAlign: 'center' }}
      />

      <span style={{ fontSize: '1.2em' }}>:</span>

      {/* 2. 분 입력 (Select) */}
      <select
        value={minute}
        onChange={handleMinuteChange}
        style={{ width: '50px', textAlign: 'center' }}
      >
        {minuteOptions.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
};

// 🌟 React.memo를 사용하여 props가 변경되지 않으면 리렌더링 방지
export default React.memo(TimeNumberInput);

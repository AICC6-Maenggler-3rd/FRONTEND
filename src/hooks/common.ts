import { useState, useEffect } from 'react';

type ActionFunction = (event?: React.SyntheticEvent | any) => void;

function useSingleAndDoubleClick(
  actionSimpleClick: ActionFunction,
  actionDoubleClick: ActionFunction,
  delay = 250,
) {
  const [click, setClick] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      // simple click
      if (click === 1) {
        console.log('한번클릭');
        actionSimpleClick();
        setClick(0);
      }
    }, delay);

    // the duration between this click and the previous one
    // is less than the value of delay = double-click
    if (click === 2) {
      console.log('두번클릭');
      actionDoubleClick();
      setClick(0);
    }

    return () => clearTimeout(timer);
  }, [click]);

  return () => setClick((prev) => prev + 1);
}

export default useSingleAndDoubleClick;

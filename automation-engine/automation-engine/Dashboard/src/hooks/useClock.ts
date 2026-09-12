import { useState, useEffect } from 'react';

export function useClock() {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');

  const timeStr = `${hours}:${minutes}:${seconds} UTC`;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const dayOfWeek = days[now.getUTCDay()];
  const dayOfMonth = now.getUTCDate();
  const monthName = months[now.getUTCMonth()];
  const year = now.getUTCFullYear();

  const dateStr = `${dayOfWeek}, ${dayOfMonth} ${monthName} ${year}`;

  return { timeStr, dateStr };
}

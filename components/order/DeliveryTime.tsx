import { useEffect, useState } from "react";


interface CountdownCellProps {
  deliveryTime: string | Date;
  status: string;
}

export default function CountdownCell({ deliveryTime, status }: CountdownCellProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isLate, setIsLate] = useState(false);

  useEffect(() => {
    if (status !== "In_Progress") {
      setTimeLeft("N/A");
      return;
    }

    const target = new Date(deliveryTime).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      let diff = target - now;

      if (diff >= 0) {
        // Countdown before delivery
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setTimeLeft(
          `${days > 0 ? days + "d " : ""}${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
        setIsLate(false);
      } else {
        // Late count after delivery
        diff = Math.abs(diff); // convert to positive
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setTimeLeft(
          `Late ${days > 0 ? days + "d " : ""}${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
        setIsLate(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deliveryTime, status]);

  return (
    <div style={{ color: isLate ? "red" : "inherit" }}>
      {timeLeft}
    </div>
  );
}

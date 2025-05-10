export default function Spinner({
  size = 32,
  color = "#FFCC00",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`rounded-full animate-spin border-4 border-t-[${color}] border-b-[${color}] border-l-transparent border-r-transparent ${className}`}
      style={{
        width: size,
        height: size,
        borderColor: `${color} ${color} transparent transparent`,
      }}
    />
  );
}

/**
 * Spinner — accessible loading indicator
 * Props: size ('sm' | 'md' | 'lg'), fullPage (boolean)
 */
const sizeMap = {
  sm: 'w-5 h-5 border-2',
  md: 'w-9 h-9 border-[3px]',
  lg: 'w-14 h-14 border-4',
};

const Spinner = ({ size = 'md', fullPage = false }) => {
  const ring = (
    <span
      role="status"
      aria-label="Loading…"
      className={`inline-block rounded-full border-primary-500 border-t-transparent animate-spin ${sizeMap[size]}`}
    />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark-900/80 backdrop-blur-sm">
        <div className={`inline-block rounded-full border-primary-500 border-t-transparent animate-spin w-14 h-14 border-4`} />
        <p className="mt-4 text-gray-400 text-sm animate-pulse-slow">Loading…</p>
      </div>
    );
  }

  return ring;
};

export default Spinner;

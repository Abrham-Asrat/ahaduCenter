interface SortingFilterProps {
  count: number;
  total: number;
  loading: boolean;
  value: string;
  options: string[];
  itemLabel?: string;
  onChange: (value: string) => void;
}

const SortingFilter = ({
  count,
  total,
  loading,
  value,
  options,
  itemLabel = 'titles',
  onChange,
}: SortingFilterProps) => (
  <div className="fixed inset-x-3 top-[150px] z-20 flex flex-col items-stretch gap-3 rounded-xl border border-white/10 bg-background/95 p-3.5 glass-panel backdrop-blur-md sm:flex-row sm:items-center sm:justify-between lg:left-[calc(50%-208px)] lg:right-8 xl:left-[calc(50%-336px)] xl:right-[calc(50%-640px)]">
    <span className="text-xs font-medium text-on-surface-variant sm:text-sm">
      {loading ? (
        <span className="inline-block h-4 w-32 animate-pulse rounded bg-surface-container" />
      ) : (
        <>
          Showing <strong className="text-white">{count}</strong> of{' '}
          <strong className="text-white">{total}</strong> {itemLabel}
        </>
      )}
    </span>
    <div className="flex items-center justify-between gap-2 sm:justify-end">
      <span className="text-xs font-medium text-on-surface-variant sm:text-sm">Sort by:</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 max-w-full cursor-pointer rounded-lg border border-white/10 bg-background px-2 py-1 text-xs font-semibold text-primary outline-none sm:px-3 sm:text-sm"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  </div>
);

export default SortingFilter;
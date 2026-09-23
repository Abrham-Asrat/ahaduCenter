interface ProductSpecsProps {
  specifications?: Record<string, string | number>;
  description?: string;
}

const ProductSpecs = ({ specifications, description }: ProductSpecsProps) => {
  const specEntries = Object.entries(specifications ?? {});

  return (
    <div className="rounded-[28px] border border-white/10 bg-card-surface/60 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.35)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold tracking-[-0.04em] text-white">Product details</h2>
      </div>

      <p className="text-sm leading-7 text-on-surface-variant">
        {description || 'Built for everyday performance and long-term reliability.'}
      </p>

      {specEntries.length > 0 ? (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {specEntries.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-surface-container/80 p-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-light-gray">{label}</div>
              <div className="mt-2 text-base font-semibold text-white">{String(value)}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {[
            ['Category', 'Electronics'],
            ['Condition', 'New'],
            ['Warranty', '12 months'],
            ['Delivery', 'Free shipping'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-surface-container/80 p-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-light-gray">{label}</div>
              <div className="mt-2 text-base font-semibold text-white">{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSpecs;

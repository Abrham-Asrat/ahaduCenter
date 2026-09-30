import { useTranslation } from 'react-i18next';

interface ProductSpecsProps {
  specifications?: Record<string, string | number>;
  description?: string;
}

const ProductSpecs = ({ specifications, description }: ProductSpecsProps) => {
  const { t } = useTranslation();
  const specEntries = Object.entries(specifications ?? {});

  return (
    <div className="rounded-[28px] border border-white/10 bg-card-surface/60 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.35)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold tracking-[-0.04em] text-white">{t('electronics.productDetails')}</h2>
      </div>

      <p className="text-sm leading-7 text-on-surface-variant">
        {description || t('electronics.defaultDescription')}
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
            [t('electronics.category'), t('electronics.title')],
            [t('electronics.condition'), t('electronics.conditionNew')],
            [t('electronics.warranty'), t('electronics.warrantyDefault')],
            [t('electronics.delivery'), t('electronics.freeShipping')],
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

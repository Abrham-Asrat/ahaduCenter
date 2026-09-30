import { ArrowRight, CheckCircle2, Heart, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProductInfoProps {
  product: {
    name?: string;
    title?: string;
    brand?: string;
    condition?: string;
    price?: number;
    originalPrice?: number;
    rating?: number;
    reviews?: number;
    description?: string;
    highlights?: string[];
    id?: string;
  };
  onShowToast?: (msg: string) => void;
  onConfirmPickUp?: (quantity?: number) => void;
  orderLoading?: boolean;
  orderError?: string | null;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
  wishlistLoading?: boolean;
}

const ProductInfo = ({
  product,
  onConfirmPickUp,
  orderLoading = false,
  orderError,
  isWishlisted = false,
  onToggleWishlist,
  wishlistLoading = false,
}: ProductInfoProps) => {
  const { t } = useTranslation();
  const title = product.title || product.name || t('electronics.product');
  const price = product.price ?? 0;
  const originalPrice = product.originalPrice ?? 0;

  return (
    <div className="rounded-[28px] border border-white/10 bg-card-surface/60 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.35)]">
      <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.2em] text-primary">
        <span>{product.brand || t('electronics.premiumPick')}</span>
        <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px]">
          {product.condition || t('electronics.conditionNew')}
        </span>
      </div>

      <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-white">{title}</h1>

      <div className="mt-4 flex items-center gap-3 text-sm text-on-surface-variant">
        <div className="flex items-center gap-1 text-primary">
          <Star size={16} className="fill-current" />
          <span>{product.rating ?? 4.8}</span>
        </div>
        <span>•</span>
        <span>{t('electronics.reviewsCount', { count: product.reviews ?? 128 })}</span>
      </div>

      <div className="mt-6 flex items-end gap-3">
        <div className="text-3xl font-bold text-white">${price.toLocaleString()}</div>
        {originalPrice > 0 && (
          <div className="text-lg text-on-surface-variant line-through">${originalPrice.toLocaleString()}</div>
        )}
      </div>

      <p className="mt-5 text-sm leading-7 text-on-surface-variant">
        {product.description || t('electronics.defaultProductDescription')}
      </p>

      <div className="mt-6 space-y-3">
        {(product.highlights && product.highlights.length > 0 ? product.highlights : [
          t('electronics.highlight1'),
          t('electronics.highlight2'),
          t('electronics.highlight3'),
        ]).map((item) => (
          <div key={item} className="flex items-start gap-3 text-sm text-white/90">
            <CheckCircle2 size={18} className="mt-0.5 text-primary" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        <button
          type="button"
          onClick={() => onConfirmPickUp?.(1)}
          disabled={orderLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-slate-950 transition-opacity hover:opacity-90 disabled:opacity-70"
        >
          {orderLoading ? t('electronics.processing') : t('electronics.reservePickUp')}
          <ArrowRight size={16} />
        </button>

        <button
          type="button"
          onClick={onToggleWishlist}
          disabled={wishlistLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-60"
        >
          <Heart size={16} className={isWishlisted ? 'fill-primary text-primary' : ''} />
          {isWishlisted ? t('electronics.removeFromWishlist') : t('electronics.addToWishlist')}
        </button>
      </div>

      {orderError && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {orderError}
        </div>
      )}
    </div>
  );
};

export default ProductInfo;

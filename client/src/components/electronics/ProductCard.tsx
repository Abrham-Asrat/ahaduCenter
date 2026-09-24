import { Heart, Plus, Scale, Star } from 'lucide-react';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  isWishlisted?: boolean;
  onAddToCart?: (product: Product) => void;
  onCompare?: (product: Product) => void;
  onToggleWishlist?: (product: Product, isSaved: boolean) => void;
}

const ProductCard = ({
  product,
  isWishlisted = false,
  onAddToCart,
  onCompare,
  onToggleWishlist,
}: ProductCardProps) => {
  const productId = product._id || product.id || 'product';
  const image = product.imageUrl || product.images?.[0] || 'https://via.placeholder.com/600x400/0f172a/ffffff?text=Product';
  const title = product.title || product.name || 'Product';

  return (
    <article className="min-w-0 overflow-hidden rounded-[26px] border border-white/10 bg-card-surface/60 p-3 shadow-[0_20px_45px_rgba(15,23,42,0.25)] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-[20px]">
        <img src={image} alt={title} className="aspect-[4/3] w-full object-cover" />
        <button
          type="button"
          onClick={() => onToggleWishlist?.(product, !isWishlisted)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-dark-bg/80 text-white backdrop-blur-sm"
          aria-label={isWishlisted ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`}
        >
          <Heart size={16} className={isWishlisted ? 'fill-primary text-primary' : ''} />
        </button>
      </div>

      <div className="mt-4 space-y-3 px-1 pb-1">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs uppercase tracking-[0.18em] text-light-gray">
          <span className="min-w-0 max-w-full truncate">{product.brand || 'Premium'}</span>
          <span className="shrink-0">{product.condition || 'New'}</span>
        </div>

        <div>
          <h3 className="break-words text-lg font-semibold text-white">{title}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm text-on-surface-variant">
            <Star size={14} className="fill-primary text-primary" />
            <span>{product.rating ?? 4.8}</span>
            <span>•</span>
            <span>{product.reviews ?? 128} reviews</span>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xl font-bold text-white sm:text-2xl">${Number(product.price ?? 0).toLocaleString()}</div>
            {product.originalPrice && (
              <div className="text-sm text-on-surface-variant line-through">${Number(product.originalPrice).toLocaleString()}</div>
            )}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => onCompare?.(product)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-primary/50 hover:text-primary"
              aria-label={`Compare ${title}`}
            >
              <Scale size={16} />
            </button>
            <button
              type="button"
              onClick={() => onAddToCart?.(product)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-slate-950 transition-opacity hover:opacity-90"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>
      </div>

      <a href={`/electronics/${productId}`} className="sr-only">View details</a>
    </article>
  );
};

export default ProductCard;

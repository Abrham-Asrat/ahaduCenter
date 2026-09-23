import { Link } from 'react-router-dom';
import type { Product } from '../../types';

interface SimilarProductsProps {
  products: Product[];
}

const SimilarProducts = ({ products }: SimilarProductsProps) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary">More picks</p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-white sm:text-3xl">
            You may also like
          </h2>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => {
          const productId = String(product.id ?? product._id ?? '');
          const image = product.imageUrl ?? product.images?.[0] ?? 'https://via.placeholder.com/600x400/0f172a/ffffff?text=Product';
          const title = product.title || product.name || 'Product';

          return (
            <Link
              key={productId}
              to={`/electronics/${productId}`}
              className="group overflow-hidden rounded-[26px] border border-white/10 bg-card-surface/60 p-3 shadow-[0_20px_45px_rgba(15,23,42,0.25)] transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="overflow-hidden rounded-[20px] bg-surface-container">
                <img src={image} alt={title} className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-1 text-sm text-on-surface-variant">{product.brand || 'Featured item'}</p>
                </div>
                <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                  ${Number(product.price ?? 0).toLocaleString()}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default SimilarProducts;

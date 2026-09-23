import { useState } from 'react';

interface ProductGalleryProps {
  product: {
    images?: string[];
    imageUrl?: string;
    title?: string;
    name?: string;
  };
}

const ProductGallery = ({ product }: ProductGalleryProps) => {
  const images = product.images && product.images.length > 0
    ? product.images
    : [product.imageUrl || 'https://via.placeholder.com/800x600/0f172a/ffffff?text=Product'];

  const [selectedImage, setSelectedImage] = useState<string>(images[0]);

  return (
    <div className="rounded-[28px] border border-white/10 bg-card-surface/60 p-4 shadow-[0_25px_80px_rgba(15,23,42,0.35)]">
      <div className="overflow-hidden rounded-[22px] border border-white/10 bg-surface-container">
        <img
          src={selectedImage}
          alt={product.title || product.name || 'Product image'}
          className="h-[420px] w-full object-cover md:h-[520px]"
        />
      </div>

      <div className="mt-4 grid grid-cols-4 gap-3">
        {images.slice(0, 4).map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setSelectedImage(image)}
            className={`overflow-hidden rounded-xl border transition-all ${selectedImage === image
                ? 'border-primary bg-primary/10'
                : 'border-white/10 bg-surface-container hover:border-primary/40'
              }`}
          >
            <img src={image} alt={`${product.title || product.name || 'Product'} view ${index + 1}`} className="h-20 w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;

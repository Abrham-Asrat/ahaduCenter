import type { Book } from '../../types';

interface RelatedBooksProps {
  books?: Book[];
}

const RelatedBooks = ({ books = [] }: RelatedBooksProps) => {
  const sampleBooks = books.length
    ? books
    : [
      {
        _id: '1',
        title: 'The Letter of the Wind',
        author: 'Kebede Yilma',
        coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
        price: 750,
      },
      {
        _id: '2',
        title: 'City of Echoes',
        author: 'Selam Bekele',
        coverUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80',
        price: 980,
      },
    ];

  return (
    <section className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-[-0.04em] text-white">Related Books</h2>
      </div>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {sampleBooks.map((book) => (
          <div key={book._id || book.id || book.title} className="overflow-hidden rounded-[24px] border border-white/10 bg-card-surface/60 p-3">
            <img src={book.coverUrl || book.coverImage || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80'} alt={book.title} className="h-52 w-full rounded-[18px] object-cover" />
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-white">{book.title}</h3>
              <p className="mt-1 text-sm text-on-surface-variant">{book.author || 'Ahadu Press'}</p>
              <p className="mt-3 text-base font-bold text-primary">ETB {Number(book.price ?? 0).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedBooks;
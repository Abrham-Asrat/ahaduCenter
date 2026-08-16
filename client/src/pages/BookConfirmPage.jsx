// src/pages/BookConfirmPage.jsx
import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

/**
 * BookConfirmPage Component
 * 
 * Handles the confirmation flow for book actions:
 * - Borrow: Confirm borrowing with due date, loan period, pickup location
 * - Reserve: Confirm reservation with expiry date, pickup location
 * - Buy: Confirm purchase with price, quantity, shipping method
 * - Success: Shows success message after action
 * 
 * Uses URL params: ?action=borrow|reserve|buy&id=bookId
 * 
 * State:
 * - submitted: Boolean (whether action was confirmed)
 * - quantity: Number (for purchase)
 * - shippingMethod: 'pickup' | 'delivery'
 */
const BookConfirmPage = () => {
    const [searchParams] = useSearchParams();
    const action = searchParams.get('action') || 'borrow';
    const bookId = searchParams.get('id') || '1';

    const [submitted, setSubmitted] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [shippingMethod, setShippingMethod] = useState('pickup');

    // Dummy book data
    const book = {
        id: parseInt(bookId),
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        price: 24.99,
        availability: 'Available',
    };

    // Action title
    const actionTitle = {
        borrow: 'Confirm Borrowing',
        reserve: 'Confirm Reservation',
        buy: 'Confirm Purchase',
    }[action] || 'Confirm Borrowing';

    // Success title
    const successTitle = {
        borrow: 'Borrowing Confirmed!',
        reserve: 'Reservation Placed!',
        buy: 'Order Placed!',
    }[action] || 'Success!';

    // Success message
    const successMessage = {
        borrow: 'Your borrowing request has been confirmed. Pick up your book at Ahadu Center by March 15, 2025.',
        reserve: "Your reservation is placed. We'll hold the book for you until March 10, 2025.",
        buy: "Your order has been placed. You'll receive a confirmation email shortly.",
    }[action] || 'Action completed successfully.';

    // Handle confirm action
    const handleConfirm = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    // If submitted, show success state
    if (submitted) {
        return (
            <div className="min-h-screen bg-background text-on-surface flex flex-col animate-fade-in">
                <Navbar />
                <main className="flex-grow flex items-center justify-center px-4 py-12">
                    <div className="w-full max-w-md">
                        <div className="glass-panel rounded-xl p-8 flex flex-col items-center text-center">
                            {/* Check icon */}
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                                <span className="material-symbols-outlined text-primary text-4xl">check_circle</span>
                            </div>
                            {/* Title */}
                            <h1 className="text-2xl font-bold text-white mb-3">{successTitle}</h1>
                            {/* Message */}
                            <p className="text-on-surface-variant mb-8 px-2">{successMessage}</p>
                            {/* Actions */}
                            <div className="w-full flex flex-col gap-3">
                                <Link
                                    to={action === 'buy' ? '/purchase-history' : '/borrowing-history'}
                                    className="w-full py-3 rounded-lg text-xs uppercase tracking-wider text-primary border border-primary hover:bg-primary/10 transition-colors"
                                >
                                    {action === 'buy' ? 'View Purchase History' : 'View Reservations'}
                                </Link>
                                <Link
                                    to="/books"
                                    className="w-full py-3 rounded-lg text-xs uppercase tracking-wider text-on-surface-variant hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    Back to Book Center
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-on-surface flex flex-col animate-fade-in">
            <Navbar />

            <main className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-[520px]">
                    {/* Breadcrumbs */}
                    <nav className="mb-4 text-sm text-on-surface-variant flex items-center gap-1">
                        <Link to="/" className="hover:text-primary">Home</Link>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <Link to="/books" className="hover:text-primary">Books</Link>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="truncate max-w-[120px]">{book.title}</span>
                    </nav>

                    {/* Confirmation card */}
                    <div className="glass-panel rounded-xl overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-white/5">
                            <h1 className="text-2xl font-bold text-white">{actionTitle}</h1>
                        </div>

                        {/* Book summary */}
                        <div className="p-6 bg-surface-container-low/50 flex gap-4 items-center">
                            <div className="w-20 h-28 shrink-0 rounded-lg overflow-hidden border border-white/10">
                                <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">{book.title}</h2>
                                <p className="text-on-surface-variant">{book.author}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    <span className="text-xs uppercase text-primary">{book.availability}</span>
                                </div>
                            </div>
                        </div>

                        {/* Details section */}
                        <form onSubmit={handleConfirm}>
                            <div className="p-6 flex flex-col gap-4 border-t border-white/5">
                                {action === 'borrow' && (
                                    <>
                                        <DetailRow label="Loan Period" value="14 Days" />
                                        <DetailRow label="Due Date" value="March 15, 2025" bold />
                                        <DetailRow
                                            label="Pickup Location"
                                            value="Ahadu Center – Main Branch"
                                            icon="location_on"
                                        />
                                        <div className="p-4 bg-surface-container/30 rounded-lg border border-white/5 flex gap-3 items-start">
                                            <span className="material-symbols-outlined text-on-surface-variant text-lg mt-0.5">info</span>
                                            <div>
                                                <p className="text-sm text-on-surface-variant">Renewal Policy</p>
                                                <p className="text-sm text-on-surface-variant/75 mt-1">
                                                    May be renewed once if no pending reservations. Late fees apply at $0.50 per day.
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {action === 'reserve' && (
                                    <>
                                        <DetailRow label="Expiry Date" value="March 10, 2025" bold />
                                        <DetailRow
                                            label="Pickup Location"
                                            value="Main Branch – Desk A"
                                            icon="location_on"
                                        />
                                        <div className="p-4 bg-surface-container-low rounded-lg border border-white/5 flex gap-3 items-start">
                                            <span className="material-symbols-outlined text-secondary text-lg mt-0.5">info</span>
                                            <p className="text-sm text-on-surface-variant">
                                                Items are held for 3 days from the reservation date. Unclaimed items will be returned to circulation.
                                            </p>
                                        </div>
                                    </>
                                )}

                                {action === 'buy' && (
                                    <>
                                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                                            <span className="text-on-surface-variant">Quantity</span>
                                            <div className="flex items-center gap-2 bg-surface-container rounded-lg p-1 border border-white/10">
                                                <button
                                                    type="button"
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary"
                                                >
                                                    <span className="material-symbols-outlined text-sm">remove</span>
                                                </button>
                                                <span className="w-8 text-center text-white">{quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setQuantity(quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary"
                                                >
                                                    <span className="material-symbols-outlined text-sm">add</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xs uppercase text-on-surface-variant mb-2">Delivery Method</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${shippingMethod === 'pickup' ? 'border-primary/50 bg-primary/5' : 'border-white/10 bg-surface-container-low'
                                                    }`}>
                                                    <input
                                                        type="radio"
                                                        name="shipping"
                                                        value="pickup"
                                                        checked={shippingMethod === 'pickup'}
                                                        onChange={() => setShippingMethod('pickup')}
                                                        className="text-primary focus:ring-primary"
                                                    />
                                                    <span className="ml-2 text-white">Store Pickup</span>
                                                    <span className="ml-auto text-sm text-primary">Free</span>
                                                </label>
                                                <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${shippingMethod === 'delivery' ? 'border-primary/50 bg-primary/5' : 'border-white/10 bg-surface-container-low'
                                                    }`}>
                                                    <input
                                                        type="radio"
                                                        name="shipping"
                                                        value="delivery"
                                                        checked={shippingMethod === 'delivery'}
                                                        onChange={() => setShippingMethod('delivery')}
                                                        className="text-primary focus:ring-primary"
                                                    />
                                                    <span className="ml-2 text-white">Home Delivery</span>
                                                    <span className="ml-auto text-sm text-on-surface-variant">+$5.00</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pt-3 border-t border-white/10">
                                            <span className="text-lg text-on-surface-variant">Total</span>
                                            <span className="text-3xl font-bold text-primary">
                                                ${(book.price * quantity + (shippingMethod === 'delivery' ? 5 : 0)).toFixed(2)}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="p-6 flex items-center justify-between border-t border-white/5 bg-surface-container-highest/20">
                                <Link to="/books" className="text-on-surface-variant hover:text-white transition-colors px-4 py-2">
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    className="bg-primary text-black font-semibold px-8 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined">check_circle</span>
                                    {action === 'buy' ? 'Place Order' : action === 'reserve' ? 'Confirm Reservation' : 'Confirm Borrow'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

/**
 * DetailRow Component
 * Displays a label-value row with optional icon and bold value.
 */
const DetailRow = ({ label, value, bold, icon }) => (
    <div className="flex justify-between items-center py-3 border-b border-white/5">
        <span className="text-on-surface-variant">{label}</span>
        <div className="flex items-center gap-2 text-right">
            {icon && <span className="material-symbols-outlined text-primary text-sm">{icon}</span>}
            <span className={`text-white ${bold ? 'font-bold' : 'font-semibold'}`}>{value}</span>
        </div>
    </div>
);

export default BookConfirmPage;
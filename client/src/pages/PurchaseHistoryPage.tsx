import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Pagination from '../components/common/Pagination';
import { orderService } from '../services/orderService';
import { formatShortDate } from '../utils/i18nFormat';

interface PurchaseHistoryOrder {
  id?: string;
  _id?: string;
  date?: string;
  createdAt?: string;
  status?: string;
  items?: Array<{ quantity?: number }>;
  itemCount?: number;
  total?: number;
  totalPrice?: number;
}

const PurchaseHistoryPage = () => {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState<PurchaseHistoryOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await orderService.getOrderHistory({ page: currentPage, limit: 10 });
        if (!cancelled) {
          setOrders(Array.isArray(response) ? response : response?.data ?? []);
          setTotalPages(Math.max(1, Number(response?.totalPages) || 1));
        }
      } catch {
        if (!cancelled) setError(t('common.error'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadOrders();
    return () => { cancelled = true; };
  }, [currentPage, t]);

  const formatDate = (value?: string) => {
    if (!value) return '';
    return formatShortDate(value, i18n.resolvedLanguage ?? 'en') || value;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background text-on-surface flex flex-col animate-fade-in">
        <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-10 md:px-8">
          <header className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-white">{t('dashboard.purchaseHistoryPage.title')}</h1>
            <p className="text-on-surface-variant">{t('dashboard.purchaseHistoryPage.subtitle')}</p>
          </header>

          {error && <p role="alert" className="mb-6 rounded-lg border border-error/30 bg-error/10 p-4 text-error">{error}</p>}

          {loading ? (
            <p role="status" className="py-12 text-center text-on-surface-variant">{t('common.loading')}</p>
          ) : orders.length === 0 ? (
            <p className="py-12 text-center text-on-surface-variant">{t('dashboard.purchaseHistoryPage.empty')}</p>
          ) : (
            <>
              <div className="divide-y divide-white/10 border-y border-white/10">
                {orders.map((order, index) => {
                  const orderId = order.id ?? order._id ?? String(index + 1);
                  const itemCount = order.itemCount ?? order.items?.reduce((count, item) => count + (item.quantity ?? 1), 0) ?? 0;
                  const total = order.total ?? order.totalPrice;
                  return (
                    <article key={orderId} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="font-semibold text-white">{t('dashboard.purchaseHistoryPage.order', { id: orderId })}</h2>
                        <p className="mt-1 text-sm text-on-surface-variant">
                          {t('dashboard.purchaseHistoryPage.date', { date: formatDate(order.date ?? order.createdAt) })}
                          {' · '}{t('dashboard.purchaseHistoryPage.itemCount', { count: itemCount })}
                        </p>
                      </div>
                      <div className="text-sm sm:text-right">
                        <p className="font-semibold text-primary">{t('dashboard.purchaseHistoryPage.status', { status: order.status ?? '' })}</p>
                        {total !== undefined && <p className="mt-1 text-on-surface-variant">{t('dashboard.purchaseHistoryPage.total', { amount: total })}</p>}
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col items-center gap-2">
                <p className="text-xs font-semibold uppercase text-on-surface-variant">{currentPage} OF {totalPages}</p>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PurchaseHistoryPage;
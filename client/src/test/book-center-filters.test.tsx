import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bookService } from '../services/bookService';
import BookCenterPage from '../pages/BookCenterPage';
import { store } from '../redux/store';
import '../i18n/config';

vi.mock('../components/common/Navbar', () => ({ default: () => null }));

const renderBookCenter = () => {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <BookCenterPage />
      </MemoryRouter>
    </Provider>
  );
};

const getFormatSelect = () => {
  const option = screen.getByRole('option', { name: 'Paperback' });
  if (!(option.parentElement instanceof HTMLSelectElement)) throw new Error('Format select was not found');
  return option.parentElement;
};

describe('BookCenterPage filters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(bookService.getBooks).mockResolvedValue({ data: [], page: 1, totalPages: 1 });
  });

  it('sends selected format to the books API', async () => {
    renderBookCenter();

    fireEvent.change(getFormatSelect(), { target: { value: 'Paperback' } });

    await waitFor(() => {
      expect(bookService.getBooks).toHaveBeenLastCalledWith(expect.objectContaining({
        format: 'Paperback',
        page: 1,
      }));
    });
  });

  it('resets filter controls and clears format from the query', async () => {
    renderBookCenter();

    fireEvent.change(getFormatSelect(), { target: { value: 'Hardcover' } });
    await waitFor(() => expect(bookService.getBooks).toHaveBeenLastCalledWith(expect.objectContaining({ format: 'Hardcover' })));

    fireEvent.click(screen.getAllByRole('button', { name: 'Clear Filters' })[0]);

    await waitFor(() => {
      expect(getFormatSelect()).toHaveValue('All');
      expect(bookService.getBooks).toHaveBeenLastCalledWith({ page: 1, limit: 12 });
    });
  });
});

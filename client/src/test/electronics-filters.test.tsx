import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ElectronicsFilters from '../components/electronics/ElectronicsFilters';

describe('ElectronicsFilters', () => {
  it('emits the supported refurbished condition', () => {
    const onFilterChange = vi.fn();
    render(<ElectronicsFilters onFilterChange={onFilterChange} />);

    const conditionSelect = screen.getByRole('option', { name: 'Refurbished' }).parentElement;
    if (!(conditionSelect instanceof HTMLSelectElement)) throw new Error('Condition select was not found');
    fireEvent.change(conditionSelect, { target: { value: 'Refurbished' } });

    expect(onFilterChange).toHaveBeenLastCalledWith(expect.objectContaining({
      conditions: ['Refurbished'],
    }));
  });

  it('emits both slider bounds and resets the price range', () => {
    const onFilterChange = vi.fn();
    render(<ElectronicsFilters onFilterChange={onFilterChange} />);

    fireEvent.change(screen.getByRole('slider', { name: 'Minimum price' }), { target: { value: '10000' } });
    fireEvent.change(screen.getByRole('slider', { name: 'Maximum price' }), { target: { value: '80000' } });

    expect(onFilterChange).toHaveBeenLastCalledWith(expect.objectContaining({
      minPrice: 10000,
      maxPrice: 80000,
    }));

    fireEvent.click(screen.getByRole('button', { name: 'Clear Filters' }));

    expect(screen.getByRole('slider', { name: 'Minimum price' })).toHaveValue('0');
    expect(screen.getByRole('slider', { name: 'Maximum price' })).toHaveValue('150000');
    expect(onFilterChange).toHaveBeenLastCalledWith(expect.objectContaining({
      minPrice: 0,
      maxPrice: 150000,
      conditions: [],
      brands: [],
      searchQuery: '',
    }));
  });
});

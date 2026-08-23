/**
 * Tests for BookCoverCard component — Tasks 11.1 and 11.2
 *
 * Task 11.1 — Property-based tests for toggle behaviors
 *   **Validates: Requirements 4.2, 4.3**
 *
 *   Property 3: BookCoverCard Save toggle is an involution
 *     For any initial saved state (starts at false), clicking Save twice
 *     SHALL return the component to its original saved state (isSaved = false).
 *
 *   Property 4: BookCoverCard Zoom toggle is an involution
 *     For any initial zoom state (starts at false), clicking Zoom twice
 *     SHALL return the component to its original zoom state (isZoomed = false).
 *
 * Task 11.2 — Example tests for Share and QR
 *   **Validates: Requirements 4.1, 4.4**
 *
 *   - Mock navigator.clipboard.writeText; click Share; assert it was called
 *     and a toast confirming the copy is shown.
 *   - Click QR button; assert toast "QR Code coming soon" is rendered.
 */

import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';

import BookCoverCard from '../components/book/BookCoverCard';

// ─────────────────────────────────────────────────────────────────────────────
// Shared test fixture
// ─────────────────────────────────────────────────────────────────────────────

const mockBook = {
    coverUrl: 'https://example.com/cover.jpg',
    title: 'Test Book',
    availability: 'Available',
};

const renderCard = () => render(<BookCoverCard book={mockBook} />);

// ─────────────────────────────────────────────────────────────────────────────
// Task 11.1 — Property 3: Save toggle is an involution
// Validates: Requirements 4.2
// ─────────────────────────────────────────────────────────────────────────────

describe('BookCoverCard Save toggle — Property 3 (Validates: Requirements 4.2)', () => {
    it('clicking Save twice returns the bookmark icon to the unsaved state (involution)', () => {
        fc.assert(
            fc.property(
                // We only ever start from the default state (isSaved = false).
                // fast-check runs this property numRuns times, each in a fresh render.
                fc.constant(null),
                (_) => {
                    const { getByRole, unmount } = render(<BookCoverCard book={mockBook} />);

                    const saveButton = getByRole('button', { name: /save|unsave/i });

                    // Verify the initial state — bookmark icon present, not saved
                    const iconBefore = saveButton.querySelector('.material-symbols-outlined');
                    expect(iconBefore.textContent.trim()).toBe('bookmark');

                    // First click — toggle ON (saved)
                    fireEvent.click(saveButton);
                    const iconAfterFirstClick = saveButton.querySelector('.material-symbols-outlined');
                    expect(iconAfterFirstClick.textContent.trim()).toBe('bookmark_added');

                    // Second click — toggle OFF (back to original state)
                    fireEvent.click(saveButton);
                    const iconAfterSecondClick = saveButton.querySelector('.material-symbols-outlined');
                    expect(iconAfterSecondClick.textContent.trim()).toBe('bookmark');

                    unmount();
                }
            ),
            { numRuns: 10 }
        );
    });

    it('Save button aria-label reflects the current saved state', () => {
        const { getByRole } = renderCard();

        const saveButton = getByRole('button', { name: /save/i });
        expect(saveButton).toHaveAttribute('aria-label', 'Save');

        fireEvent.click(saveButton);
        expect(saveButton).toHaveAttribute('aria-label', 'Unsave');

        fireEvent.click(saveButton);
        expect(saveButton).toHaveAttribute('aria-label', 'Save');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Task 11.1 — Property 4: Zoom toggle is an involution
// Validates: Requirements 4.3
// ─────────────────────────────────────────────────────────────────────────────

describe('BookCoverCard Zoom toggle — Property 4 (Validates: Requirements 4.3)', () => {
    it('clicking Zoom twice returns the cover image to its original unzoomed state (involution)', () => {
        fc.assert(
            fc.property(
                fc.constant(null),
                (_) => {
                    const { getByRole, getByAltText, unmount } = render(<BookCoverCard book={mockBook} />);

                    const zoomButton = getByRole('button', { name: /zoom/i });
                    const coverImg = getByAltText(mockBook.title);

                    // Initial state: no scale-110
                    expect(coverImg.className).not.toContain('scale-110');

                    // First click — zoom ON
                    fireEvent.click(zoomButton);
                    expect(coverImg.className).toContain('scale-110');

                    // Second click — zoom OFF (back to original)
                    fireEvent.click(zoomButton);
                    expect(coverImg.className).not.toContain('scale-110');

                    unmount();
                }
            ),
            { numRuns: 10 }
        );
    });

    it('Zoom button aria-label reflects the current zoom state', () => {
        const { getByRole } = renderCard();

        const zoomButton = getByRole('button', { name: /zoom in/i });
        expect(zoomButton).toHaveAttribute('aria-label', 'Zoom in');

        fireEvent.click(zoomButton);
        expect(zoomButton).toHaveAttribute('aria-label', 'Zoom out');

        fireEvent.click(zoomButton);
        expect(zoomButton).toHaveAttribute('aria-label', 'Zoom in');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Task 11.2 — Example tests for Share and QR
// Validates: Requirements 4.1, 4.4
// ─────────────────────────────────────────────────────────────────────────────

describe('BookCoverCard Share button (Validates: Requirements 4.1)', () => {
    beforeEach(() => {
        // Mock navigator.clipboard.writeText
        Object.defineProperty(navigator, 'clipboard', {
            value: { writeText: vi.fn().mockResolvedValue(undefined) },
            configurable: true,
            writable: true,
        });
    });

    it('calls navigator.clipboard.writeText with the current page URL when Share is clicked', async () => {
        renderCard();

        const shareButton = screen.getByRole('button', { name: /share/i });
        fireEvent.click(shareButton);

        expect(navigator.clipboard.writeText).toHaveBeenCalledOnce();
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(window.location.href);
    });

    it('shows a toast confirming the copy after clicking Share', async () => {
        renderCard();

        const shareButton = screen.getByRole('button', { name: /share/i });
        fireEvent.click(shareButton);

        // Toast should appear after the async clipboard call resolves
        await waitFor(() => {
            expect(screen.getByRole('status')).toBeInTheDocument();
            expect(screen.getByRole('status')).toHaveTextContent(/link copied/i);
        });
    });
});

describe('BookCoverCard QR button (Validates: Requirements 4.4)', () => {
    it('shows "QR Code coming soon" toast when QR button is clicked', async () => {
        renderCard();

        const qrButton = screen.getByRole('button', { name: /qr code/i });
        fireEvent.click(qrButton);

        await waitFor(() => {
            expect(screen.getByRole('status')).toBeInTheDocument();
            expect(screen.getByRole('status')).toHaveTextContent('QR Code coming soon');
        });
    });
});

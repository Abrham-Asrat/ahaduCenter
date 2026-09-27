/**
 * i18n Formatting Utilities
 * 
 * Locale-aware date formatting functions using Intl.DateTimeFormat.
 * Note: Numbers and currency are kept as-is (not locale-formatted per requirements).
 */

/**
 * Generic date formatter
 */
export function formatDate(
  date: string | Date,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  } catch {
    return '';
  }
}

/**
 * Format date in short style: "Jan 15, 2024"
 */
export function formatShortDate(date: string | Date, locale: string): string {
  return formatDate(date, locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format date in long style: "January 15, 2024"
 */
export function formatLongDate(date: string | Date, locale: string): string {
  return formatDate(date, locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format member since date: "Jan 2024"
 */
export function formatMemberSince(date: string | Date, locale: string): string {
  return formatDate(date, locale, {
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format date with month and day only: "Jan 15"
 */
export function formatMonthDay(date: string | Date, locale: string): string {
  return formatDate(date, locale, {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format relative time (e.g., "2 days ago")
 * Falls back to short date if Intl.RelativeTimeFormat is not supported
 */
export function formatRelativeTime(date: string | Date, locale: string): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return diffMins <= 1 ? 'Just now' : `${diffMins} minutes ago`;
      }
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    }

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    // Fall back to short date for older dates
    return formatShortDate(dateObj, locale);
  } catch {
    return '';
  }
}

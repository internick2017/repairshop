import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
}

/**
 * Sanitize plain text input to prevent injection attacks
 */
export function sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Sanitize phone numbers - keep only digits, spaces, +, -, (, )
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^0-9\s+\-()]/g, '').trim();
}

/**
 * Sanitize numeric input
 */
export function sanitizeNumber(value: string | number): number {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? 0 : num;
}

/**
 * Sanitize URL to prevent injection
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
}

/**
 * Sanitize form data object
 */
export function sanitizeFormData<T extends Record<string, unknown>>(data: T): T {
  const sanitized = {} as T;
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Apply appropriate sanitization based on field name
      if (key.toLowerCase().includes('email')) {
        sanitized[key as keyof T] = sanitizeEmail(value) as T[keyof T];
      } else if (key.toLowerCase().includes('phone')) {
        sanitized[key as keyof T] = sanitizePhone(value) as T[keyof T];
      } else if (key.toLowerCase().includes('url') || key.toLowerCase().includes('website')) {
        sanitized[key as keyof T] = sanitizeUrl(value) as T[keyof T];
      } else if (key.toLowerCase().includes('description') || key.toLowerCase().includes('notes')) {
        // For rich text fields, use HTML sanitization
        sanitized[key as keyof T] = sanitizeHtml(value) as T[keyof T];
      } else {
        // Default text sanitization
        sanitized[key as keyof T] = sanitizeText(value) as T[keyof T];
      }
    } else if (typeof value === 'number') {
      sanitized[key as keyof T] = sanitizeNumber(value) as T[keyof T];
    } else if (typeof value === 'boolean' || value === null || value === undefined) {
      sanitized[key as keyof T] = value;
    } else if (Array.isArray(value)) {
      // Recursively sanitize array items
      sanitized[key as keyof T] = value.map(item => 
        typeof item === 'object' ? sanitizeFormData(item) : item
      ) as T[keyof T];
    } else if (typeof value === 'object') {
      // Recursively sanitize nested objects
      sanitized[key as keyof T] = sanitizeFormData(value) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value;
    }
  }
  
  return sanitized;
}

/**
 * Validate and sanitize SQL-like input to prevent SQL injection
 * (Though we're using parameterized queries, this is an extra layer)
 */
export function sanitizeSqlInput(input: string): string {
  return input
    .replace(/['";\\]/g, '') // Remove quotes and backslashes
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove multi-line comment starts
    .replace(/\*\//g, ''); // Remove multi-line comment ends
}
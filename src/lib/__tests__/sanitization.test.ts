import { describe, it, expect } from 'vitest'
import { 
  sanitizeText, 
  sanitizeEmail, 
  sanitizePhone, 
  sanitizeFormData 
} from '../sanitization'

describe('sanitization utilities', () => {
  describe('sanitizeText', () => {
    it('removes HTML tags', () => {
      expect(sanitizeText('<script>alert("xss")</script>hello')).toBe('hello')
      expect(sanitizeText('hello<>world')).toBe('helloworld')
    })

    it('removes javascript protocols', () => {
      expect(sanitizeText('javascript:alert("xss")')).toBe('')
    })

    it('removes event handlers', () => {
      expect(sanitizeText('onclick=alert("xss")')).toBe('')
      expect(sanitizeText('onload=malicious()')).toBe('')
    })

    it('trims whitespace', () => {
      expect(sanitizeText('  hello world  ')).toBe('hello world')
    })
  })

  describe('sanitizeEmail', () => {
    it('converts to lowercase', () => {
      expect(sanitizeEmail('TEST@EXAMPLE.COM')).toBe('test@example.com')
    })

    it('trims whitespace', () => {
      expect(sanitizeEmail('  test@example.com  ')).toBe('test@example.com')
    })
  })

  describe('sanitizePhone', () => {
    it('keeps only valid phone characters', () => {
      expect(sanitizePhone('+1 (555) 123-4567')).toBe('+1 (555) 123-4567')
      expect(sanitizePhone('555.123.4567abc')).toBe('555.1234567')
    })

    it('removes invalid characters', () => {
      expect(sanitizePhone('555-123-4567<script>')).toBe('555-123-4567')
    })
  })

  describe('sanitizeFormData', () => {
    it('sanitizes string fields appropriately', () => {
      const input = {
        firstName: '<script>alert("xss")</script>John',
        email: '  TEST@EXAMPLE.COM  ',
        phone: '+1 (555) 123-4567abc',
        description: '<p>Hello <script>alert("xss")</script></p>',
        active: true,
        count: 42
      }

      const result = sanitizeFormData(input)

      expect(result.firstName).toBe('John')
      expect(result.email).toBe('test@example.com')
      expect(result.phone).toBe('+1 (555) 123-4567')
      expect(result.description).toBe('<p>Hello </p>')
      expect(result.active).toBe(true)
      expect(result.count).toBe(42)
    })

    it('handles nested objects', () => {
      const input = {
        user: {
          name: '<script>alert("xss")</script>John',
          email: '  TEST@EXAMPLE.COM  '
        },
        metadata: {
          tags: ['<script>', 'normal-tag']
        }
      }

      const result = sanitizeFormData(input)

      expect(result.user.name).toBe('John')
      expect(result.user.email).toBe('test@example.com')
      expect(result.metadata.tags).toEqual(['', 'normal-tag'])
    })

    it('preserves null and undefined values', () => {
      const input = {
        nullValue: null,
        undefinedValue: undefined,
        name: 'John'
      }

      const result = sanitizeFormData(input)

      expect(result.nullValue).toBe(null)
      expect(result.undefinedValue).toBe(undefined)
      expect(result.name).toBe('John')
    })
  })
})
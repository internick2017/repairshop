/**
 * Detect Next.js navigation signals (redirect, notFound) so try/catch blocks
 * in Server Components don't accidentally swallow them.
 *
 * Next.js implements redirect() and notFound() by throwing a special error
 * with a `digest` like "NEXT_REDIRECT;..." or "NEXT_NOT_FOUND". The framework
 * catches that at the boundary and turns it into an actual navigation. If
 * application code wraps everything in try/catch and treats the throw as a
 * normal error, the page renders an error UI instead of navigating.
 *
 * Call this at the top of any catch block that might swallow navigation:
 *
 *   } catch (error) {
 *     if (isNextNavigationError(error)) throw error
 *     // ...real error handling
 *   }
 */
export function isNextNavigationError(error: unknown): boolean {
  if (error instanceof Error && (error.message === 'NEXT_REDIRECT' || error.message === 'NEXT_NOT_FOUND')) {
    return true
  }
  const digest = (error as { digest?: unknown } | null)?.digest
  return typeof digest === 'string' && digest.startsWith('NEXT_')
}

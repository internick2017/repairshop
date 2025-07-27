import '@testing-library/jest-dom'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock Kinde Auth
vi.mock('@kinde-oss/kinde-auth-nextjs', () => ({
  useKindeBrowserClient: () => ({
    getPermission: vi.fn(() => ({ isGranted: false })),
    isLoading: false,
    user: null,
  }),
  LogoutLink: ({ children }: { children: React.ReactNode }) => (
    <a href="/logout">{children}</a>
  ),
}))

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: () => ({
    register: vi.fn(),
    handleSubmit: vi.fn((fn) => fn),
    formState: { errors: {} },
    reset: vi.fn(),
    setValue: vi.fn(),
    getValues: vi.fn(),
    watch: vi.fn(),
  }),
  FormProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useFormContext: () => ({
    register: vi.fn(),
    formState: { errors: {} },
  }),
}))

// Mock sonner toasts
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}))
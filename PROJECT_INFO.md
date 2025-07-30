# Computer Repair Shop Management System

## Project Information

### Basic Details

**Title:** Computer Repair Shop Management System

**Description:** A comprehensive web-based management application for computer repair shops that handles customer management, repair ticket tracking, and technician assignment. The system features role-based access control, real-time status updates, and a modern responsive interface with dark/light theme support. Key features include customer registration, ticket creation and tracking, technician assignment, completion status monitoring, and comprehensive search functionality.

**Technologies:**
- **Frontend:** Next.js 15.4.2, React 19.1.0, TypeScript 5+
- **Styling:** Tailwind CSS 3.4.0, shadcn/ui components, Radix UI
- **Authentication:** Kinde Auth (@kinde-oss/kinde-auth-nextjs)
- **Database:** PostgreSQL with Drizzle ORM
- **Server Actions:** Next.js Safe Actions with Zod validation
- **Error Monitoring:** Sentry 9.40.0
- **Package Manager:** Yarn 1.22.22
- **Testing:** Vitest with React Testing Library
- **Icons:** Lucide React
- **Forms:** React Hook Form with Zod validation

### Links

**GitHub URL:** [Your repository URL here - you'll need to provide this]

**Demo/Live URL:** [Your live deployment URL here - you'll need to provide this]

### Visual Assets

**Available Screenshots:**

#### High-Quality Mock Screenshots (Recommended for Project Showcase)
- `dashboard-mock.png` (37KB) - Main dashboard with statistics and quick actions
- `tickets-mock.png` (34KB) - Tickets management page with table view  
- `customers-mock.png` (36KB) - Customer management page

*Note: All authentication-related screenshots have been cleaned up. Only the high-quality mock screenshots remain.*

### Recommended Project Image

**Use:** `dashboard-mock.png` (36KB, 73 lines)

This is the best representation of your application as it shows:
- Modern, clean dashboard interface
- Professional design with Tailwind CSS
- Statistics cards and quick actions
- Responsive layout
- Dark/light theme support
- Realistic mock data

### Key Features Highlighted in Screenshots

1. **Dashboard (`dashboard-mock.png`)**
   - Statistics overview (Total Tickets: 24, Open: 8, Completed: 16, Success Rate: 87%)
   - Quick action buttons (Create Ticket, Add Customer, View All Tickets)
   - Recent activity feed
   - Modern card-based layout

2. **Tickets Management (`tickets-mock.png`)**
   - Data table with ticket information
   - Search and filter functionality
   - Status indicators (Open/Completed)
   - Customer and technician assignment
   - Create ticket button

3. **Customer Management (`customers-mock.png`)**
   - Customer data table
   - Search functionality
   - Contact information display
   - Status indicators
   - Edit actions

### Technical Architecture

**Frontend Architecture:**
- Next.js 15 App Router
- React 19 with modern hooks
- TypeScript for type safety
- Component-based architecture
- Responsive design with Tailwind CSS

**Backend & Database:**
- PostgreSQL database
- Drizzle ORM for type-safe queries
- Next.js API routes
- Server-side rendering

**Authentication & Security:**
- Kinde Auth integration
- Role-based access control
- Middleware protection
- Session management

**Development Tools:**
- ESLint for code quality
- Vitest for testing
- Playwright for E2E testing
- Sentry for error monitoring

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (rs)/              # Route group for repair shop
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── tickets/       # Ticket management
│   │   ├── customers/     # Customer management
│   │   └── users/         # User management
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Form components
│   └── optimistic/       # Optimistic UI components
├── lib/                  # Utility functions
│   ├── actions/          # Server actions
│   ├── queries/          # Database queries
│   └── hooks/            # Custom React hooks
└── db/                   # Database schema and migrations
```

### Deployment Ready

The project is configured for deployment with:
- Vercel deployment configuration
- Environment variable management
- Database migration scripts
- Production build optimization
- Error monitoring with Sentry

### Usage Instructions

1. **Installation:**
   ```bash
   yarn install
   ```

2. **Development:**
   ```bash
   yarn dev
   ```

3. **Build:**
   ```bash
   yarn build
   ```

4. **Database Setup:**
   ```bash
   yarn db:migrate
   yarn db:seed
   ```

### Screenshot Generation

The project includes a Playwright script for generating mock screenshots:
- `create-mock-screenshots.js` - Mock HTML screenshots (recommended)

To generate new screenshots:
```bash
node create-mock-screenshots.js
```

*Note: All temporary screenshot generation scripts have been cleaned up and added to .gitignore.*

---

**Note:** The mock screenshots provide the best representation of the application's functionality and design, as they show the actual interface without authentication barriers. Use these for project showcases and documentation. 
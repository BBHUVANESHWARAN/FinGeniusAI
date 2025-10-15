# FinGenius AI Super App

## Overview
FinGenius AI is a comprehensive personal finance management platform powered by AI. Built with a completely free and open-source stack, it helps users track expenses, manage budgets, set bill reminders, and receive intelligent financial insights in both English and Tamil.

## Current State
**Phase**: MVP Development - Frontend Complete, Backend in Progress
**Last Updated**: October 15, 2025

## Recent Changes
- **Oct 15, 2025**: Completed Phase 1 - Schema & Frontend
  - Implemented comprehensive data models for transactions, budgets, bills, and AI insights
  - Built complete React component library with exceptional visual quality
  - Implemented bilingual support (English/Tamil) with language context
  - Created dark/light theme support with theme context
  - Designed professional finance dashboard with metric cards, charts, and data visualizations
  - Built all feature pages: Dashboard, Transactions, Budgets, Bills, AI Insights
  - Configured design system with proper color tokens and typography

## Project Architecture

### Technology Stack
- **Frontend**: React + Vite, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, Node.js
- **AI**: Gemini AI (free tier - 15 requests/min)
- **Storage**: In-memory storage (MemStorage) for MVP
- **State Management**: TanStack Query (React Query v5)
- **Routing**: Wouter
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Shadcn UI (Radix UI primitives)

### Key Features
1. **Dashboard**: Financial overview with balance, income, expenses, savings metrics
2. **Transaction Management**: Add, view, filter, and delete income/expense transactions
3. **Budget Planning**: Create budgets, track spending with 50-30-20 rule visualization
4. **Bill Reminders**: Set up recurring bills with due date tracking
5. **AI Insights**: Gemini-powered financial tips and recommendations
6. **Bilingual Support**: Seamless English/Tamil language switching
7. **Dark Mode**: Full theme support with smooth transitions
8. **Multi-Currency**: Support for INR, USD, EUR, GBP

### Data Models
- **Transactions**: type, amount, currency, category, description, merchant, date
- **Budgets**: category, limit, period (weekly/monthly/yearly), currency
- **Bills**: name, amount, due date, category, recurring status, frequency
- **Insights**: type (tip/warning/achievement/recommendation), title, content, priority

### File Structure
```
client/
├── src/
│   ├── components/
│   │   ├── ui/ (Shadcn components)
│   │   ├── app-sidebar.tsx
│   │   ├── MetricCard.tsx
│   │   ├── TransactionList.tsx
│   │   ├── BudgetProgress.tsx
│   │   ├── AddTransactionDialog.tsx
│   │   ├── AddBudgetDialog.tsx
│   │   └── AddBillDialog.tsx
│   ├── contexts/
│   │   ├── LanguageContext.tsx
│   │   └── ThemeContext.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Transactions.tsx
│   │   ├── Budgets.tsx
│   │   ├── Bills.tsx
│   │   └── Insights.tsx
│   ├── App.tsx
│   └── index.css
server/
├── routes.ts (API endpoints)
├── storage.ts (Data storage interface)
└── gemini.ts (AI integration - to be added)
shared/
└── schema.ts (TypeScript types and Zod schemas)
```

## User Preferences
- **Language Support**: Must support Tamil and English with easy switching
- **Design**: Professional finance dashboard with trust-conveying design
- **Technology**: 100% free and open-source stack
- **AI Features**: Powered by Gemini AI for intelligent insights

## API Endpoints (To Be Implemented)
- `GET /api/transactions` - List all transactions
- `POST /api/transactions` - Create transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `POST /api/transactions/categorize` - AI-powered categorization
- `GET /api/budgets` - List all budgets
- `POST /api/budgets` - Create budget
- `GET /api/bills` - List all bills
- `POST /api/bills` - Create bill
- `PATCH /api/bills/:id` - Update bill (mark as paid)
- `DELETE /api/bills/:id` - Delete bill
- `GET /api/insights` - List AI insights
- `POST /api/insights/generate` - Generate new insights

## Environment Variables
- `GEMINI_API_KEY` - Gemini AI API key (configured)
- `SESSION_SECRET` - Session secret (configured)

## Design System
- **Primary Color**: Deep Blue (220 75% 50%) - Trust & professionalism
- **Success Color**: Green (142 76% 45%) - Profits, savings
- **Warning Color**: Amber (38 92% 50%) - Budget alerts
- **Danger Color**: Red (0 84% 60%) - Expenses, overbudget
- **Fonts**: Inter (primary), Noto Sans Tamil (Tamil support), JetBrains Mono (numbers)
- **Spacing**: Consistent 2, 4, 6, 8, 12, 16 units
- **Border Radius**: md (6px) for cards and components

## Next Steps
1. Implement all backend API endpoints
2. Add Gemini AI integration for expense categorization and insights
3. Connect frontend to backend with proper error handling
4. Add loading states throughout the application
5. Test all features end-to-end

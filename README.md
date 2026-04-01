# Zorvyn Finance Dashboard

A clean, responsive, and interactive finance dashboard built as part of the **Zorvyn Frontend Developer Intern Assessment**.  
The project focuses on presenting financial data in a simple and intuitive way through summary cards, charts, insights, and transaction management.

## Live Demo
[Live Demo](https://finance-dashboard-mu-steel.vercel.app/)

## GitHub Repository
[Source Code](https://github.com/RishiRajLimshakre/zorvyn-finance-dashboard.git)

---

## Overview

This dashboard helps users track and understand financial activity through:
- a high-level financial summary
- transaction exploration
- spending insights
- role-based UI behavior

The application is fully frontend-based and uses mock data to simulate a real finance dashboard experience.

---

## Features

- **Dashboard Overview**
  - Net balance
  - Total income
  - Total expenses
  - Savings rate

- **Visualizations**
  - Time-based chart for cash flow trend
  - Category-based chart for spending breakdown

- **Transactions Section**
  - Transaction list with date, description, category, type, and amount
  - Search functionality
  - Filtering by type and category
  - Sorting options

- **Role-Based UI**
  - **Viewer**: read-only access
  - **Admin**: can add, edit, and delete transactions

- **Insights Section**
  - Savings rate insight
  - Top spending category
  - Largest single expense
  - Spending pace observations

- **Extra Enhancements**
  - Dark mode
  - Local storage persistence
  - Responsive design
  - Empty state handling

---

## Tech Stack

- **React.js**
- **JavaScript**
- **Vite**
- **CSS**
- **Zustand**
- **Recharts**
- **Lucide React**

---

## Why This Approach

I chose this stack to keep the project lightweight, fast, and easy to maintain:

- **React + JavaScript** for rapid frontend development
- **Zustand** for simple and effective state management
- **Recharts** for clean chart rendering
- **Plain CSS** for custom layout control and responsiveness
- **Mock data** because the assignment is frontend-focused and does not require backend integration

---

## Role Behavior

### Viewer
- Can view dashboard data
- Can use search, filters, and sorting
- Cannot modify transactions

### Admin
- Can view dashboard data
- Can add transactions
- Can edit transactions
- Can delete transactions

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/RishiRajLimshakre/zorvyn-finance-dashboard.git

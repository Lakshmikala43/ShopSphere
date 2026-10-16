# 🛍️ ShopSphere — Enterprise E-Commerce & Retail Intelligence Platform

> **A Production-Grade, Full-Stack Modern E-Commerce Platform built with Next.js 14, React 18, TypeScript 5, Prisma ORM, and Tailwind CSS**

ShopSphere is an enterprise-scale online shopping and retail operations platform featuring catalog management, full-text product search, dynamic basket checkout, role-based access control, automated invoice rendering, analytics dashboards, and supply chain logistics.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [System Architecture & Tech Stack](#system-architecture--tech-stack)
- [Installation & Setup](#installation--setup)
- [Build Instructions](#build-instructions)
- [Running the Application](#running-the-application)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Docker Support](#docker-support)
- [License & Usage](#license--usage)

---

## 🎯 Project Overview

ShopSphere delivers a high-performance storefront designed for low-latency product exploration and frictionless multi-vendor transactions.

### Key Capabilities:
- **Instant Product Search & Filtering**: Client and server-side faceted query refinement.
- **Persistent Shopping Cart & Checkout**: Concurrency-safe cart synchronizer with real-time stock allocation.
- **Order Management & Fulfillment**: Complete lifecycle tracking from order placement through shipment dispatch.
- **Admin Operations Portal**: Real-time sales telemetry, gross merchandise value (GMV) charts, and stock alerts.
- **100% Offline & Zero API Key Guarantee**: Functions without third-party proprietary API keys.

---

## 🏛 System Architecture & Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React 18, TypeScript 5, Tailwind CSS, Framer Motion, Lucide Icons
- **ORM & Data**: Prisma ORM, SQLite / PostgreSQL
- **Authentication**: JWT & Bcrypt password encryption
- **Containerization**: Docker, Docker Compose

---

## 💻 Installation & Setup

### Prerequisites
- Node.js 18.x or 20.x
- npm 9.x or higher

```bash
# 1. Clone repository
git clone https://github.com/Lakshmikala43/ShopSphere.git
cd ShopSphere

# 2. Install dependencies
npm install

# 3. Initialize Database Schema
npx prisma generate
npx prisma db push
```

---

## 🔨 Build Instructions

```bash
# Compile and build Next.js application
npm run build
```

Alternatively using the Makefile:
```bash
make build
```

---

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### Production Mode
```bash
npm start
```

---

## 🧪 Testing & Quality Assurance

Run the automated integration test suite:
```bash
npm test
```

---

## 🐳 Docker Deployment

```bash
# Build and run container
docker build -t shopsphere:latest .
docker run -p 3000:3000 shopsphere:latest
```

Or using Docker Compose:
```bash
docker-compose up --build
```

---

## 🔒 License & Intellectual Property

Copyright (c) 2026 ShopSphere Systems. All rights reserved.
Proprietary software. Unauthorized copying, distribution, or reproduction is strictly prohibited.

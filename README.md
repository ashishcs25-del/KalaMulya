# KalaMulya

**Fair Pricing and Digital Provenance for Karnataka's Heritage Artisans**

KalaMulya is a digital platform designed to help traditional artisans present their handcrafted products, understand fair pricing, and preserve the cultural stories behind their craft.

The platform connects artisan heritage with digital commerce through transparent pricing, digital Craft Passports, and a marketplace experience.

## Key Features

### Explainable Fair Pricing
Helps artisans estimate a fair selling price using factors such as materials, labour hours, skill, and craftsmanship.

### Digital Craft Passport
Provides a digital record for a handcrafted product, including its craft story, materials, making process, and product details.

### Artisan Marketplace
Showcases traditional handcrafted products and helps customers discover artisan-made goods.

### Multilingual Experience
Supports a more accessible experience for users through English and Kannada language options.

### Order Management
Supports the order journey from purchase through order-status updates.

## Technology Stack

- **Frontend:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS
- **Database and backend services:** Supabase integration, with local demo-data support where configured
- **Testing:** Vitest

## Getting Started

### Prerequisites

- Node.js and npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/ashishcs25-del/KalaMulya.git
cd KalaMulya
```

Install dependencies:

```bash
npm install
```

### Environment Configuration

If you use Supabase or optional AI features, configure the required environment variables in a local `.env.local` file according to `.env.example` and the application's configuration.

Never commit `.env.local`, API keys, passwords, or other secrets to version control.

### Run Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Refer to `package.json` for other available scripts.

## Project Structure

- `src/` — application source code
- `data/` — local data and demo-data support
- `supabase/` — Supabase-related configuration or resources
- `scripts/` — utility scripts
- `tests/` — automated tests

## Project Vision

KalaMulya aims to make traditional craftsmanship more visible and economically sustainable by combining transparent pricing, digital product provenance, and accessible online discovery.

**Preserving heritage. Supporting artisans. Building trust in every craft.**
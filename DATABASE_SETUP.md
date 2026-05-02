# Database Setup Instructions for TradeTrack

## Required Schema Updates

To enable Phase 2 features (Invoice Generation & Inventory Management), you need to run the following SQL in your Supabase SQL Editor:

```sql
-- TradeTrack Database Schema
-- Run this in your Supabase SQL Editor

-- 1. Create the Products Table
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    cost_price DECIMAL(10, 2) DEFAULT 0,
    selling_price DECIMAL(10, 2) DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Update the Transactions Table (if not already enhanced)
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS product_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS selling_price DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for Products
CREATE POLICY "Users can view their own products"
ON products FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products"
ON products FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products"
ON products FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products"
ON products FOR DELETE
USING (auth.uid() = user_id);
```

## Testing Phase 2 Features

### 1. Invoice Generation
- Navigate to `/dashboard/history`
- Click the invoice icon on any sales transaction
- Verify PDF download works correctly
- Check invoice formatting and content

### 2. Inventory Management
- Navigate to `/dashboard/products`
- Test adding a new product
- Test editing an existing product
- Test deleting a product
- Verify stock level calculations
- Check low stock alerts

### 3. Enhanced Forms
- Navigate to `/dashboard/add/sale`
- Test product tracking and profit calculations
- Navigate to `/dashboard/add/expense`
- Test category selection and expense tracking

## Dependencies
- jsPDF: For PDF generation
- html2canvas: For PDF rendering (if needed)
- All dependencies are already installed via npm

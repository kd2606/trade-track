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



-- 2. Create the Budgets Table

CREATE TABLE budgets (

    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    user_id UUID REFERENCES auth.users(id) NOT NULL,

    category VARCHAR(100) NOT NULL,

    budget_amount DECIMAL(10, 2) NOT NULL,

    period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('monthly', 'quarterly', 'yearly')),

    start_date DATE NOT NULL,

    end_date DATE NOT NULL,

    description TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL

);



-- 3. Create the Transactions Table (Enhanced)

CREATE TABLE transactions (

    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    user_id UUID REFERENCES auth.users(id) NOT NULL,

    type VARCHAR(50) NOT NULL CHECK (type IN ('sale', 'expense')),

    amount DECIMAL(10, 2) NOT NULL,

    category VARCHAR(100) NOT NULL,

    product_name VARCHAR(200),

    description TEXT,

    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    cost_price DECIMAL(10, 2) DEFAULT 0,

    selling_price DECIMAL(10, 2) DEFAULT 0,

    quantity INTEGER DEFAULT 1,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL

);



-- 4. Enable Row Level Security (RLS)

-- This ensures users can only see their own business data!

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;



-- 5. Create RLS Policies for Products

-- Policy: Users can view their own products

CREATE POLICY "Users can view their own products"

ON products FOR SELECT

USING (auth.uid() = user_id);



-- Policy: Users can insert their own products

CREATE POLICY "Users can insert their own products"

ON products FOR INSERT

WITH CHECK (auth.uid() = user_id);



-- Policy: Users can update their own products

CREATE POLICY "Users can update their own products"

ON products FOR UPDATE

USING (auth.uid() = user_id)

WITH CHECK (auth.uid() = user_id);



-- Policy: Users can delete their own products

CREATE POLICY "Users can delete their own products"

ON products FOR DELETE

USING (auth.uid() = user_id);



-- 5. Create RLS Policies for Transactions

-- Policy: Users can view their own transactions

CREATE POLICY "Users can view their own transactions"

ON transactions FOR SELECT

USING (auth.uid() = user_id);



-- Policy: Users can insert their own transactions

CREATE POLICY "Users can insert their own transactions"

ON transactions FOR INSERT

WITH CHECK (auth.uid() = user_id);



-- Policy: Users can update their own transactions

CREATE POLICY "Users can update their own transactions"

ON transactions FOR UPDATE

USING (auth.uid() = user_id)

WITH CHECK (auth.uid() = user_id);



-- Policy: Users can delete their own transactions

CREATE POLICY "Users can delete their own transactions"

ON transactions FOR DELETE

USING (auth.uid() = user_id);


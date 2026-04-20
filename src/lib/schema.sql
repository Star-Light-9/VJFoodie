-- ============================================================
-- VJFoodie Database Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. PROFILES TABLE
-- Links to auth.users via user_id (UUID)
CREATE TABLE IF NOT EXISTS profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'staff'))
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  category_id SERIAL PRIMARY KEY,
  category_name TEXT NOT NULL UNIQUE
);

-- 3. MENU TABLE
CREATE TABLE IF NOT EXISTS menu (
  item_id SERIAL PRIMARY KEY,
  item_name TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(category_id) ON DELETE SET NULL,
  item_price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  description TEXT
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  order_id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  order_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'Order Placed' CHECK (status IN ('Order Placed', 'Preparing', 'Ready', 'Completed', 'Cancelled')),
  total_price NUMERIC(10, 2) NOT NULL
);

-- 5. ORDER_ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  order_item_id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL REFERENCES menu(item_id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_time NUMERIC(10, 2) NOT NULL
);

-- 6. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
  payment_id SERIAL PRIMARY KEY,
  order_id INTEGER UNIQUE NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('wallet', 'upi', 'card', 'cash')),
  payment_status TEXT NOT NULL DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  amount NUMERIC(10, 2) NOT NULL
);

-- 7. INVENTORY TABLE
CREATE TABLE IF NOT EXISTS inventory (
  inventory_id SERIAL PRIMARY KEY,
  item_id INTEGER NOT NULL REFERENCES menu(item_id) ON DELETE CASCADE,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS feedback (
  feedback_id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  order_id INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- TRIGGER: Auto-create profile when a new user signs up
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it already exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- ---- PROFILES ----
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all profiles"
  ON profiles FOR SELECT
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'staff'
  );

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow the trigger (SECURITY DEFINER) to insert profiles
CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- ---- CATEGORIES ----
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Staff can manage categories"
  ON categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid() AND profiles.role = 'staff'
    )
  );

-- ---- MENU ----
ALTER TABLE menu ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view menu"
  ON menu FOR SELECT
  USING (true);

CREATE POLICY "Staff can manage menu"
  ON menu FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid() AND profiles.role = 'staff'
    )
  );

-- ---- ORDERS ----
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can view all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid() AND profiles.role = 'staff'
    )
  );

CREATE POLICY "Staff can update any order"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid() AND profiles.role = 'staff'
    )
  );

-- ---- ORDER_ITEMS ----
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.order_id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own order items"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.order_id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can view all order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid() AND profiles.role = 'staff'
    )
  );

-- ---- PAYMENTS ----
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.order_id = payments.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own payments"
  ON payments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.order_id = payments.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can view all payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid() AND profiles.role = 'staff'
    )
  );

-- ---- INVENTORY ----
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage inventory"
  ON inventory FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid() AND profiles.role = 'staff'
    )
  );

CREATE POLICY "Anyone can view inventory"
  ON inventory FOR SELECT
  USING (true);

-- ---- FEEDBACK ----
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own feedback"
  ON feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback"
  ON feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can view all feedback"
  ON feedback FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid() AND profiles.role = 'staff'
    )
  );


-- ============================================================
-- SEED DATA: Sample categories and menu items
-- ============================================================
INSERT INTO categories (category_name) VALUES
  ('Meals'),
  ('Snacks'),
  ('Beverages'),
  ('Desserts')
ON CONFLICT (category_name) DO NOTHING;

INSERT INTO menu (item_name, category_id, item_price, image_url, description) VALUES
  ('Veg Biryani',    (SELECT category_id FROM categories WHERE category_name = 'Meals'),     120, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', 'Aromatic basmati rice with mixed vegetables'),
  ('Chicken Biryani',(SELECT category_id FROM categories WHERE category_name = 'Meals'),     150, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', 'Spicy chicken biryani with basmati rice'),
  ('Dal Rice',       (SELECT category_id FROM categories WHERE category_name = 'Meals'),      70, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', 'Lentil curry with steamed rice'),
  ('Samosa',         (SELECT category_id FROM categories WHERE category_name = 'Snacks'),     15, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', 'Crispy samosa with potato filling'),
  ('Vada Pav',       (SELECT category_id FROM categories WHERE category_name = 'Snacks'),     25, 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400', 'Mumbai style vada pav'),
  ('Pav Bhaji',      (SELECT category_id FROM categories WHERE category_name = 'Snacks'),     80, 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400', 'Spicy vegetable curry with buttered bread'),
  ('Paneer Tikka',   (SELECT category_id FROM categories WHERE category_name = 'Snacks'),    100, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', 'Grilled paneer with spices'),
  ('Cold Coffee',    (SELECT category_id FROM categories WHERE category_name = 'Beverages'),  50, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', 'Iced coffee with cream'),
  ('Fresh Lime Soda',(SELECT category_id FROM categories WHERE category_name = 'Beverages'),  30, 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2fdc?w=400', 'Refreshing lime soda'),
  ('Masala Chai',    (SELECT category_id FROM categories WHERE category_name = 'Beverages'),  15, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400', 'Spiced Indian tea'),
  ('Gulab Jamun',    (SELECT category_id FROM categories WHERE category_name = 'Desserts'),   40, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', 'Sweet milk dumplings in syrup'),
  ('Ice Cream',      (SELECT category_id FROM categories WHERE category_name = 'Desserts'),   60, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', 'Vanilla ice cream')
ON CONFLICT DO NOTHING;

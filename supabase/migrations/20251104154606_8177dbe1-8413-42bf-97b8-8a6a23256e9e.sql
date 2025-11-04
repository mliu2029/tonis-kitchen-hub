-- Create shelves table for QR code tracking
CREATE TABLE public.shelves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code text UNIQUE NOT NULL,
  location text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create inventory items table
CREATE TABLE public.inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shelf_id uuid REFERENCES public.shelves(id) ON DELETE SET NULL,
  name text NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  category text NOT NULL,
  expiry_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create volunteer tasks table
CREATE TABLE public.volunteer_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_name text NOT NULL,
  description text,
  assigned_to text,
  completed boolean DEFAULT false,
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create suggestions table
CREATE TABLE public.suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  suggestion text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.shelves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

-- Public read access for shelves (for QR scanning)
CREATE POLICY "Anyone can view shelves"
  ON public.shelves FOR SELECT
  USING (true);

-- Public read access for inventory
CREATE POLICY "Anyone can view inventory"
  ON public.inventory_items FOR SELECT
  USING (true);

-- Allow authenticated users to manage inventory
CREATE POLICY "Authenticated users can manage inventory"
  ON public.inventory_items FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Public read for volunteer tasks
CREATE POLICY "Anyone can view tasks"
  ON public.volunteer_tasks FOR SELECT
  USING (true);

-- Authenticated users can manage tasks
CREATE POLICY "Authenticated users can manage tasks"
  ON public.volunteer_tasks FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Anyone can submit suggestions
CREATE POLICY "Anyone can create suggestions"
  ON public.suggestions FOR INSERT
  WITH CHECK (true);

-- Public read for suggestions
CREATE POLICY "Anyone can view suggestions"
  ON public.suggestions FOR SELECT
  USING (true);

-- Authenticated users can update suggestion status
CREATE POLICY "Authenticated users can update suggestions"
  ON public.suggestions FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_inventory_items_updated_at
  BEFORE UPDATE ON public.inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_volunteer_tasks_updated_at
  BEFORE UPDATE ON public.volunteer_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
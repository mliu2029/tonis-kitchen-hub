-- Add policies for authenticated users to manage shelves
CREATE POLICY "Authenticated users can manage shelves"
  ON public.shelves FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Insert sample shelves for QR scanning
INSERT INTO public.shelves (qr_code, location, description) VALUES
  ('SHELF-A1', 'Aisle A - Shelf 1', 'Canned goods and non-perishables'),
  ('SHELF-A2', 'Aisle A - Shelf 2', 'Pasta and grains'),
  ('SHELF-B1', 'Aisle B - Shelf 1', 'Fresh produce area'),
  ('SHELF-B2', 'Aisle B - Shelf 2', 'Frozen foods'),
  ('SHELF-C1', 'Aisle C - Shelf 1', 'Dairy and refrigerated items');

-- Insert sample inventory items
INSERT INTO public.inventory_items (shelf_id, name, category, quantity, expiry_date, notes) 
SELECT 
  s.id,
  'Canned Tomatoes',
  'canned',
  45,
  CURRENT_DATE + INTERVAL '6 months',
  'Store brand, 14oz cans'
FROM public.shelves s WHERE s.qr_code = 'SHELF-A1'
LIMIT 1;

INSERT INTO public.inventory_items (shelf_id, name, category, quantity, expiry_date, notes) 
SELECT 
  s.id,
  'Black Beans',
  'canned',
  8,
  CURRENT_DATE + INTERVAL '8 months',
  'Low stock - needs restocking'
FROM public.shelves s WHERE s.qr_code = 'SHELF-A1'
LIMIT 1;

INSERT INTO public.inventory_items (shelf_id, name, category, quantity, expiry_date, notes) 
SELECT 
  s.id,
  'Spaghetti',
  'dry',
  32,
  CURRENT_DATE + INTERVAL '1 year',
  '1lb packages'
FROM public.shelves s WHERE s.qr_code = 'SHELF-A2'
LIMIT 1;

INSERT INTO public.inventory_items (shelf_id, name, category, quantity, expiry_date, notes) 
SELECT 
  s.id,
  'Rice',
  'dry',
  5,
  CURRENT_DATE + INTERVAL '1 year',
  'Long grain white rice - LOW STOCK'
FROM public.shelves s WHERE s.qr_code = 'SHELF-A2'
LIMIT 1;

-- Insert sample volunteer tasks
INSERT INTO public.volunteer_tasks (task_name, description, assigned_to, due_date, completed) VALUES
  ('Sort incoming donations', 'Organize and categorize new donations received this week', 'Sarah Johnson', CURRENT_DATE + INTERVAL '2 days', false),
  ('Restock shelves A1-A2', 'Move items from storage to main shelves', 'Mike Chen', CURRENT_DATE + INTERVAL '1 day', false),
  ('Check expiry dates', 'Review all items expiring within 30 days', 'Maria Garcia', CURRENT_DATE + INTERVAL '3 days', false),
  ('Clean refrigeration units', 'Weekly cleaning of all refrigerators and freezers', null, CURRENT_DATE + INTERVAL '5 days', false);

-- Insert sample suggestions
INSERT INTO public.suggestions (name, email, suggestion, status) VALUES
  ('John Doe', 'john@example.com', 'It would be great to have a mobile app for volunteers to check in and see their tasks on the go.', 'pending'),
  ('Anonymous', null, 'Consider adding more vegetarian protein options to the inventory.', 'reviewed'),
  ('Lisa Smith', 'lisa@community.org', 'The QR code system is amazing! Could we also track donation sources?', 'pending');
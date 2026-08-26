ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read subjects" ON subjects FOR SELECT USING (true);

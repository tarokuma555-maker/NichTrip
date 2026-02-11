CREATE TABLE IF NOT EXISTS auto_enrichment_queue (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  work_title text NOT NULL,
  work_data jsonb NOT NULL,
  spots_data jsonb NOT NULL,
  status text DEFAULT 'pending',
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE auto_enrichment_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can manage queue" ON auto_enrichment_queue
  FOR ALL USING (true);

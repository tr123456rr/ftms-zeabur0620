
-- 建立 running_records 表
CREATE TABLE public.running_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  duration integer NOT NULL,
  distance numeric NOT NULL,
  pace text NOT NULL,
  location text,
  calories integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 啟用 Row Level Security
ALTER TABLE public.running_records ENABLE ROW LEVEL SECURITY;

-- 僅允許本人可 SELECT 自己的資料
CREATE POLICY "Users can view their own running records"
  ON public.running_records
  FOR SELECT
  USING (auth.uid() = user_id);

-- 僅允許本人可 INSERT
CREATE POLICY "Users can insert their own running records"
  ON public.running_records
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 僅允許本人可 UPDATE
CREATE POLICY "Users can update their own running records"
  ON public.running_records
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 僅允許本人可 DELETE
CREATE POLICY "Users can delete their own running records"
  ON public.running_records
  FOR DELETE
  USING (auth.uid() = user_id);


-- 新增平均心律欄位
ALTER TABLE public.running_records
ADD COLUMN avg_heart_rate integer DEFAULT NULL;

-- 新增平均步伐欄位
ALTER TABLE public.running_records
ADD COLUMN avg_pace text DEFAULT NULL;

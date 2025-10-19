-- Add edited_by_user column to recipes table
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS edited_by_user BOOLEAN NOT NULL DEFAULT false;

-- Add comment to describe the column
COMMENT ON COLUMN recipes.edited_by_user IS 'Flag indicating if the recipe has been manually edited by the user after AI generation';

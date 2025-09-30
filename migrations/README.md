# Database Migrations - Escola Inglês Pareto

This directory contains SQL migration files for the Supabase database schema.

## Migration Files

### 001_forum_schema.sql
Creates the complete forum system with:

- **Tables**:
  - `forum_topics` - Discussion topics
  - `forum_replies` - Replies to topics
  - `forum_votes` - Voting system for topics and replies

- **Enums**:
  - `forum_category_enum` - Categories (grammar, vocabulary, conversation, culture, homework)
  - `topic_status_enum` - Status (open, closed, pinned, resolved)
  - `vote_enum` - Vote types (up, down)

- **Features**:
  - Row Level Security (RLS) policies
  - Automatic triggers for counting replies and votes
  - Indexing for performance
  - Sample data for testing

- **Profile Extensions**:
  - `posts_count` - Number of forum posts by user
  - `reputation_score` - User reputation in the forum
  - `badges` - Array of achievement badges

## Running Migrations

### Option 1: Using the Migration Script
```bash
node run-migration.js
```

### Option 2: Manual Execution in Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of the migration file
4. Execute the SQL

### Option 3: Using Supabase CLI (if available)
```bash
supabase db reset
supabase migration up
```

## Migration Order
Migrations should be run in numerical order:
1. 001_forum_schema.sql
2. (future migrations)

## Rollback
To rollback the forum migration, run:
```sql
-- Drop tables (in order due to foreign keys)
DROP TABLE IF EXISTS forum_votes;
DROP TABLE IF EXISTS forum_replies;
DROP TABLE IF EXISTS forum_topics;

-- Drop enums
DROP TYPE IF EXISTS vote_enum;
DROP TYPE IF EXISTS topic_status_enum;
DROP TYPE IF EXISTS forum_category_enum;

-- Remove profile extensions
ALTER TABLE profiles DROP COLUMN IF EXISTS posts_count;
ALTER TABLE profiles DROP COLUMN IF EXISTS reputation_score;
ALTER TABLE profiles DROP COLUMN IF EXISTS badges;
```

## Testing the Migration
After running the migration, verify:
1. Tables exist: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'forum_%';`
2. Sample data exists: `SELECT COUNT(*) FROM forum_topics;`
3. Triggers work: Insert a test reply and check if `replies_count` updates
4. RLS policies work: Test as different users

## Notes
- The migration includes IF NOT EXISTS checks to prevent errors on re-running
- All forum tables have RLS enabled for security
- Triggers automatically maintain counts and timestamps
- Sample data is included for immediate testing
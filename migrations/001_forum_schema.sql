-- Forum System Migration - Escola Inglês Pareto
-- Creates all necessary tables, enums, and triggers for the forum system
-- Date: 2025-09-25

-- Create custom enum types for forum
DO $$
BEGIN
    -- Forum categories enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'forum_category_enum') THEN
        CREATE TYPE forum_category_enum AS ENUM (
            'grammar',
            'vocabulary',
            'conversation',
            'culture',
            'homework'
        );
    END IF;

    -- Topic status enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'topic_status_enum') THEN
        CREATE TYPE topic_status_enum AS ENUM (
            'open',
            'closed',
            'pinned',
            'resolved'
        );
    END IF;

    -- Vote type enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vote_enum') THEN
        CREATE TYPE vote_enum AS ENUM (
            'up',
            'down'
        );
    END IF;
END $$;

-- Create forum_topics table
CREATE TABLE IF NOT EXISTS forum_topics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category forum_category_enum NOT NULL,
    status topic_status_enum DEFAULT 'open',
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    views_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    last_reply_at TIMESTAMP WITH TIME ZONE,
    last_reply_by UUID REFERENCES auth.users(id),
    tags TEXT[] DEFAULT '{}',
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    is_resolved BOOLEAN DEFAULT false,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0
);

-- Create forum_replies table
CREATE TABLE IF NOT EXISTS forum_replies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    topic_id UUID REFERENCES forum_topics(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_reply_id UUID REFERENCES forum_replies(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_edited BOOLEAN DEFAULT false,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    is_moderated BOOLEAN DEFAULT false,
    is_best_answer BOOLEAN DEFAULT false
);

-- Create forum_votes table
CREATE TABLE IF NOT EXISTS forum_votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES forum_topics(id) ON DELETE CASCADE,
    reply_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
    vote_type vote_enum NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_topic_vote UNIQUE(user_id, topic_id),
    CONSTRAINT unique_user_reply_vote UNIQUE(user_id, reply_id),
    CONSTRAINT vote_target_check CHECK (
        (topic_id IS NOT NULL AND reply_id IS NULL) OR
        (topic_id IS NULL AND reply_id IS NOT NULL)
    )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_forum_topics_category ON forum_topics(category);
CREATE INDEX IF NOT EXISTS idx_forum_topics_author ON forum_topics(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_status ON forum_topics(status);
CREATE INDEX IF NOT EXISTS idx_forum_topics_created_at ON forum_topics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_topics_updated_at ON forum_topics(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_forum_replies_topic ON forum_replies(topic_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_author ON forum_replies(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_parent ON forum_replies(parent_reply_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_created_at ON forum_replies(created_at);

CREATE INDEX IF NOT EXISTS idx_forum_votes_user ON forum_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_votes_topic ON forum_votes(topic_id);
CREATE INDEX IF NOT EXISTS idx_forum_votes_reply ON forum_votes(reply_id);

-- Extend profiles table for forum functionality
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS posts_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reputation_score INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}';

-- Create trigger functions for automatic updates
CREATE OR REPLACE FUNCTION update_topic_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE forum_topics
        SET replies_count = replies_count + 1,
            last_reply_at = NEW.created_at,
            last_reply_by = NEW.author_id,
            updated_at = NOW()
        WHERE id = NEW.topic_id;

        -- Update user's posts count
        UPDATE profiles
        SET posts_count = posts_count + 1
        WHERE user_id = NEW.author_id;

        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE forum_topics
        SET replies_count = replies_count - 1,
            updated_at = NOW()
        WHERE id = OLD.topic_id;

        -- Update user's posts count
        UPDATE profiles
        SET posts_count = posts_count - 1
        WHERE user_id = OLD.author_id;

        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function for vote counting
CREATE OR REPLACE FUNCTION update_vote_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.topic_id IS NOT NULL THEN
            IF NEW.vote_type = 'up' THEN
                UPDATE forum_topics SET upvotes = upvotes + 1 WHERE id = NEW.topic_id;
            ELSE
                UPDATE forum_topics SET downvotes = downvotes + 1 WHERE id = NEW.topic_id;
            END IF;
        ELSIF NEW.reply_id IS NOT NULL THEN
            IF NEW.vote_type = 'up' THEN
                UPDATE forum_replies SET upvotes = upvotes + 1 WHERE id = NEW.reply_id;
            ELSE
                UPDATE forum_replies SET downvotes = downvotes + 1 WHERE id = NEW.reply_id;
            END IF;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.topic_id IS NOT NULL THEN
            IF OLD.vote_type = 'up' THEN
                UPDATE forum_topics SET upvotes = upvotes - 1 WHERE id = OLD.topic_id;
            ELSE
                UPDATE forum_topics SET downvotes = downvotes - 1 WHERE id = OLD.topic_id;
            END IF;
        ELSIF OLD.reply_id IS NOT NULL THEN
            IF OLD.vote_type = 'up' THEN
                UPDATE forum_replies SET upvotes = upvotes - 1 WHERE id = OLD.reply_id;
            ELSE
                UPDATE forum_replies SET downvotes = downvotes - 1 WHERE id = OLD.reply_id;
            END IF;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trg_forum_replies_count ON forum_replies;
CREATE TRIGGER trg_forum_replies_count
    AFTER INSERT OR DELETE ON forum_replies
    FOR EACH ROW EXECUTE FUNCTION update_topic_reply_count();

DROP TRIGGER IF EXISTS trg_forum_votes_count ON forum_votes;
CREATE TRIGGER trg_forum_votes_count
    AFTER INSERT OR DELETE ON forum_votes
    FOR EACH ROW EXECUTE FUNCTION update_vote_count();

DROP TRIGGER IF EXISTS trg_forum_topics_updated_at ON forum_topics;
CREATE TRIGGER trg_forum_topics_updated_at
    BEFORE UPDATE ON forum_topics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_forum_replies_updated_at ON forum_replies;
CREATE TRIGGER trg_forum_replies_updated_at
    BEFORE UPDATE ON forum_replies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_votes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for forum_topics
DROP POLICY IF EXISTS "Forum topics are viewable by authenticated users" ON forum_topics;
CREATE POLICY "Forum topics are viewable by authenticated users"
    ON forum_topics FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Users can create forum topics" ON forum_topics;
CREATE POLICY "Users can create forum topics"
    ON forum_topics FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can edit their own forum topics" ON forum_topics;
CREATE POLICY "Users can edit their own forum topics"
    ON forum_topics FOR UPDATE
    TO authenticated
    USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete their own forum topics" ON forum_topics;
CREATE POLICY "Users can delete their own forum topics"
    ON forum_topics FOR DELETE
    TO authenticated
    USING (auth.uid() = author_id);

-- Create RLS policies for forum_replies
DROP POLICY IF EXISTS "Forum replies are viewable by authenticated users" ON forum_replies;
CREATE POLICY "Forum replies are viewable by authenticated users"
    ON forum_replies FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Users can create forum replies" ON forum_replies;
CREATE POLICY "Users can create forum replies"
    ON forum_replies FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can edit their own forum replies" ON forum_replies;
CREATE POLICY "Users can edit their own forum replies"
    ON forum_replies FOR UPDATE
    TO authenticated
    USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete their own forum replies" ON forum_replies;
CREATE POLICY "Users can delete their own forum replies"
    ON forum_replies FOR DELETE
    TO authenticated
    USING (auth.uid() = author_id);

-- Create RLS policies for forum_votes
DROP POLICY IF EXISTS "Forum votes are viewable by authenticated users" ON forum_votes;
CREATE POLICY "Forum votes are viewable by authenticated users"
    ON forum_votes FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Users can create forum votes" ON forum_votes;
CREATE POLICY "Users can create forum votes"
    ON forum_votes FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own forum votes" ON forum_votes;
CREATE POLICY "Users can update their own forum votes"
    ON forum_votes FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own forum votes" ON forum_votes;
CREATE POLICY "Users can delete their own forum votes"
    ON forum_votes FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Insert some sample data for testing
INSERT INTO forum_topics (title, content, category, author_id, tags)
SELECT
    'Welcome to the English Learning Forum!',
    'This is a place where students and teachers can discuss English learning topics, share tips, and help each other improve. Feel free to ask questions and participate in discussions!',
    'conversation',
    (SELECT id FROM auth.users LIMIT 1),
    ARRAY['welcome', 'introduction', 'guidelines']
WHERE NOT EXISTS (SELECT 1 FROM forum_topics WHERE title = 'Welcome to the English Learning Forum!');

INSERT INTO forum_topics (title, content, category, author_id, tags)
SELECT
    'Common Grammar Mistakes to Avoid',
    'Let''s discuss the most common grammar mistakes that English learners make and how to avoid them. Share your experiences and tips!',
    'grammar',
    (SELECT id FROM auth.users LIMIT 1),
    ARRAY['grammar', 'mistakes', 'tips']
WHERE NOT EXISTS (SELECT 1 FROM forum_topics WHERE title = 'Common Grammar Mistakes to Avoid');

INSERT INTO forum_topics (title, content, category, author_id, tags)
SELECT
    'Building Your Vocabulary Effectively',
    'What are the best strategies for expanding your English vocabulary? Share your favorite methods and resources.',
    'vocabulary',
    (SELECT id FROM auth.users LIMIT 1),
    ARRAY['vocabulary', 'learning', 'strategies']
WHERE NOT EXISTS (SELECT 1 FROM forum_topics WHERE title = 'Building Your Vocabulary Effectively');

-- Migration complete
SELECT 'Forum schema migration completed successfully!' as result;
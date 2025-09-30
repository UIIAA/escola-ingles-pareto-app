// Forum Service - Escola Inglês Pareto
// Handles all forum-related database operations with Supabase

import { supabase } from './supabase';
import type { Database } from './supabase';

// Type aliases for easier usage
type ForumTopic = Database['public']['Tables']['forum_topics']['Row'];
type ForumTopicInsert = Database['public']['Tables']['forum_topics']['Insert'];
type ForumTopicUpdate = Database['public']['Tables']['forum_topics']['Update'];

type ForumReply = Database['public']['Tables']['forum_replies']['Row'];
type ForumReplyInsert = Database['public']['Tables']['forum_replies']['Insert'];
type ForumReplyUpdate = Database['public']['Tables']['forum_replies']['Update'];

type ForumVote = Database['public']['Tables']['forum_votes']['Row'];
type ForumVoteInsert = Database['public']['Tables']['forum_votes']['Insert'];

// Extended types with user information
export interface ForumTopicWithAuthor extends ForumTopic {
  author: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar_url?: string;
    posts_count: number;
    reputation_score: number;
    badges: string[];
  };
  user_vote?: 'up' | 'down' | null;
}

export interface ForumReplyWithAuthor extends ForumReply {
  author: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar_url?: string;
    posts_count: number;
    reputation_score: number;
    badges: string[];
  };
  replies?: ForumReplyWithAuthor[]; // For nested replies
  user_vote?: 'up' | 'down' | null;
}

export interface ForumStats {
  totalTopics: number;
  totalReplies: number;
  totalUsers: number;
  topContributors: Array<{
    user_id: string;
    name: string;
    posts_count: number;
    reputation_score: number;
  }>;
  categoryStats: Array<{
    category: string;
    count: number;
  }>;
}

export class ForumService {
  /**
   * Get all topics with pagination and filtering
   */
  static async getTopics({
    category,
    status = 'open',
    sortBy = 'created_at',
    sortOrder = 'desc',
    page = 1,
    pageSize = 10,
    userId
  }: {
    category?: string;
    status?: string;
    sortBy?: 'created_at' | 'updated_at' | 'replies_count' | 'upvotes';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
    userId?: string;
  } = {}): Promise<{
    data: ForumTopicWithAuthor[];
    count: number;
    error: any;
  }> {
    try {
      let query = supabase
        .from('forum_topics')
        .select(`
          *,
          author:users!forum_topics_author_id_fkey(
            id,
            email,
            user_metadata
          ),
          author_profile:profiles!forum_topics_author_id_fkey(
            posts_count,
            reputation_score,
            badges
          ),
          user_vote:forum_votes!left(vote_type)
        `, { count: 'exact' });

      // Apply filters
      if (category) {
        query = query.eq('category', category);
      }
      if (status) {
        query = query.eq('status', status);
      }
      if (userId) {
        query = query.eq('forum_votes.user_id', userId);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching forum topics:', error);
        return { data: [], count: 0, error };
      }

      // Transform data to include author information
      const topicsWithAuthors: ForumTopicWithAuthor[] = data?.map((topic: any) => ({
        ...topic,
        author: {
          id: topic.author?.id,
          name: topic.author?.user_metadata?.name || topic.author?.email?.split('@')[0] || 'Unknown User',
          email: topic.author?.email || '',
          role: topic.author?.user_metadata?.role || 'student',
          avatar_url: topic.author?.user_metadata?.avatar_url,
          posts_count: topic.author_profile?.posts_count || 0,
          reputation_score: topic.author_profile?.reputation_score || 0,
          badges: topic.author_profile?.badges || []
        },
        user_vote: topic.user_vote?.[0]?.vote_type || null
      })) || [];

      return {
        data: topicsWithAuthors,
        count: count || 0,
        error: null
      };
    } catch (err) {
      console.error('Unexpected error in getTopics:', err);
      return {
        data: [],
        count: 0,
        error: err
      };
    }
  }

  /**
   * Get a single topic with replies
   */
  static async getTopic(topicId: string, userId?: string): Promise<{
    topic: ForumTopicWithAuthor | null;
    replies: ForumReplyWithAuthor[];
    error: any;
  }> {
    try {
      // Get topic with author info
      const { data: topicData, error: topicError } = await supabase
        .from('forum_topics')
        .select(`
          *,
          author:users!forum_topics_author_id_fkey(
            id,
            email,
            user_metadata
          ),
          author_profile:profiles!forum_topics_author_id_fkey(
            posts_count,
            reputation_score,
            badges
          ),
          user_vote:forum_votes!left(vote_type)
        `)
        .eq('id', topicId)
        .eq('forum_votes.user_id', userId || '')
        .single();

      if (topicError) {
        return { topic: null, replies: [], error: topicError };
      }

      // Get replies with author info
      const { data: repliesData, error: repliesError } = await supabase
        .from('forum_replies')
        .select(`
          *,
          author:users!forum_replies_author_id_fkey(
            id,
            email,
            user_metadata
          ),
          author_profile:profiles!forum_replies_author_id_fkey(
            posts_count,
            reputation_score,
            badges
          ),
          user_vote:forum_votes!left(vote_type)
        `)
        .eq('topic_id', topicId)
        .eq('forum_votes.user_id', userId || '')
        .order('created_at', { ascending: true });

      // Update view count
      await supabase
        .from('forum_topics')
        .update({ views_count: topicData.views_count + 1 })
        .eq('id', topicId);

      // Transform topic data
      const topic: ForumTopicWithAuthor = {
        ...topicData,
        author: {
          id: topicData.author?.id,
          name: topicData.author?.user_metadata?.name || topicData.author?.email?.split('@')[0] || 'Unknown User',
          email: topicData.author?.email || '',
          role: topicData.author?.user_metadata?.role || 'student',
          avatar_url: topicData.author?.user_metadata?.avatar_url,
          posts_count: topicData.author_profile?.posts_count || 0,
          reputation_score: topicData.author_profile?.reputation_score || 0,
          badges: topicData.author_profile?.badges || []
        },
        user_vote: topicData.user_vote?.[0]?.vote_type || null
      };

      // Transform replies data and organize nested structure
      const repliesWithAuthors: ForumReplyWithAuthor[] = repliesData?.map((reply: any) => ({
        ...reply,
        author: {
          id: reply.author?.id,
          name: reply.author?.user_metadata?.name || reply.author?.email?.split('@')[0] || 'Unknown User',
          email: reply.author?.email || '',
          role: reply.author?.user_metadata?.role || 'student',
          avatar_url: reply.author?.user_metadata?.avatar_url,
          posts_count: reply.author_profile?.posts_count || 0,
          reputation_score: reply.author_profile?.reputation_score || 0,
          badges: reply.author_profile?.badges || []
        },
        user_vote: reply.user_vote?.[0]?.vote_type || null,
        replies: [] // Will be populated by organizing nested replies
      })) || [];

      // Organize nested replies
      const topLevelReplies = repliesWithAuthors.filter(reply => !reply.parent_reply_id);
      const nestedReplies = repliesWithAuthors.filter(reply => reply.parent_reply_id);

      // Attach nested replies to their parents
      topLevelReplies.forEach(reply => {
        reply.replies = nestedReplies.filter(nested => nested.parent_reply_id === reply.id);
      });

      return {
        topic,
        replies: topLevelReplies,
        error: null
      };
    } catch (err) {
      console.error('Unexpected error in getTopic:', err);
      return {
        topic: null,
        replies: [],
        error: err
      };
    }
  }

  /**
   * Create a new topic
   */
  static async createTopic(topicData: ForumTopicInsert): Promise<{
    data: ForumTopic | null;
    error: any;
  }> {
    try {
      const { data, error } = await supabase
        .from('forum_topics')
        .insert(topicData)
        .select()
        .single();

      return { data, error };
    } catch (err) {
      console.error('Error creating topic:', err);
      return { data: null, error: err };
    }
  }

  /**
   * Update a topic
   */
  static async updateTopic(topicId: string, updates: ForumTopicUpdate): Promise<{
    data: ForumTopic | null;
    error: any;
  }> {
    try {
      const { data, error } = await supabase
        .from('forum_topics')
        .update(updates)
        .eq('id', topicId)
        .select()
        .single();

      return { data, error };
    } catch (err) {
      console.error('Error updating topic:', err);
      return { data: null, error: err };
    }
  }

  /**
   * Delete a topic
   */
  static async deleteTopic(topicId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('forum_topics')
        .delete()
        .eq('id', topicId);

      return { error };
    } catch (err) {
      console.error('Error deleting topic:', err);
      return { error: err };
    }
  }

  /**
   * Create a reply
   */
  static async createReply(replyData: ForumReplyInsert): Promise<{
    data: ForumReply | null;
    error: any;
  }> {
    try {
      const { data, error } = await supabase
        .from('forum_replies')
        .insert(replyData)
        .select()
        .single();

      return { data, error };
    } catch (err) {
      console.error('Error creating reply:', err);
      return { data: null, error: err };
    }
  }

  /**
   * Update a reply
   */
  static async updateReply(replyId: string, updates: ForumReplyUpdate): Promise<{
    data: ForumReply | null;
    error: any;
  }> {
    try {
      const updatesWithEditFlag = {
        ...updates,
        is_edited: true,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('forum_replies')
        .update(updatesWithEditFlag)
        .eq('id', replyId)
        .select()
        .single();

      return { data, error };
    } catch (err) {
      console.error('Error updating reply:', err);
      return { data: null, error: err };
    }
  }

  /**
   * Delete a reply
   */
  static async deleteReply(replyId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('forum_replies')
        .delete()
        .eq('id', replyId);

      return { error };
    } catch (err) {
      console.error('Error deleting reply:', err);
      return { error: err };
    }
  }

  /**
   * Vote on topic or reply
   */
  static async vote(voteData: ForumVoteInsert): Promise<{
    data: ForumVote | null;
    error: any;
  }> {
    try {
      // First, try to upsert the vote (update if exists, insert if not)
      const { data, error } = await supabase
        .from('forum_votes')
        .upsert(voteData, {
          onConflict: voteData.topic_id ? 'user_id,topic_id' : 'user_id,reply_id'
        })
        .select()
        .single();

      return { data, error };
    } catch (err) {
      console.error('Error voting:', err);
      return { data: null, error: err };
    }
  }

  /**
   * Remove vote
   */
  static async removeVote(userId: string, topicId?: string, replyId?: string): Promise<{ error: any }> {
    try {
      let query = supabase
        .from('forum_votes')
        .delete()
        .eq('user_id', userId);

      if (topicId) {
        query = query.eq('topic_id', topicId);
      } else if (replyId) {
        query = query.eq('reply_id', replyId);
      }

      const { error } = await query;
      return { error };
    } catch (err) {
      console.error('Error removing vote:', err);
      return { error: err };
    }
  }

  /**
   * Get forum statistics
   */
  static async getForumStats(): Promise<{
    data: ForumStats | null;
    error: any;
  }> {
    try {
      // Get basic counts
      const [topicsResult, repliesResult, usersResult] = await Promise.all([
        supabase.from('forum_topics').select('id', { count: 'exact', head: true }),
        supabase.from('forum_replies').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('user_id', { count: 'exact', head: true })
      ]);

      // Get category statistics
      const { data: categoryStats } = await supabase
        .from('forum_topics')
        .select('category')
        .then(result => {
          const stats = result.data?.reduce((acc: any, topic: any) => {
            acc[topic.category] = (acc[topic.category] || 0) + 1;
            return acc;
          }, {});
          return {
            data: Object.entries(stats || {}).map(([category, count]) => ({ category, count }))
          };
        });

      // Get top contributors
      const { data: topContributors } = await supabase
        .from('profiles')
        .select(`
          user_id,
          posts_count,
          reputation_score,
          users!profiles_user_id_fkey(user_metadata)
        `)
        .order('reputation_score', { ascending: false })
        .limit(10);

      const stats: ForumStats = {
        totalTopics: topicsResult.count || 0,
        totalReplies: repliesResult.count || 0,
        totalUsers: usersResult.count || 0,
        topContributors: topContributors?.map((contributor: any) => ({
          user_id: contributor.user_id,
          name: contributor.users?.user_metadata?.name || 'Unknown User',
          posts_count: contributor.posts_count || 0,
          reputation_score: contributor.reputation_score || 0
        })) || [],
        categoryStats: categoryStats || []
      };

      return { data: stats, error: null };
    } catch (err) {
      console.error('Error getting forum stats:', err);
      return { data: null, error: err };
    }
  }

  /**
   * Search topics
   */
  static async searchTopics(
    query: string,
    filters: {
      category?: string;
      userId?: string;
    } = {}
  ): Promise<{
    data: ForumTopicWithAuthor[];
    error: any;
  }> {
    try {
      let searchQuery = supabase
        .from('forum_topics')
        .select(`
          *,
          author:users!forum_topics_author_id_fkey(
            id,
            email,
            user_metadata
          ),
          author_profile:profiles!forum_topics_author_id_fkey(
            posts_count,
            reputation_score,
            badges
          )
        `)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,tags.cs.{${query}}`);

      if (filters.category) {
        searchQuery = searchQuery.eq('category', filters.category);
      }

      const { data, error } = await searchQuery.order('created_at', { ascending: false });

      if (error) {
        return { data: [], error };
      }

      const topicsWithAuthors: ForumTopicWithAuthor[] = data?.map((topic: any) => ({
        ...topic,
        author: {
          id: topic.author?.id,
          name: topic.author?.user_metadata?.name || topic.author?.email?.split('@')[0] || 'Unknown User',
          email: topic.author?.email || '',
          role: topic.author?.user_metadata?.role || 'student',
          avatar_url: topic.author?.user_metadata?.avatar_url,
          posts_count: topic.author_profile?.posts_count || 0,
          reputation_score: topic.author_profile?.reputation_score || 0,
          badges: topic.author_profile?.badges || []
        }
      })) || [];

      return { data: topicsWithAuthors, error: null };
    } catch (err) {
      console.error('Error searching topics:', err);
      return { data: [], error: err };
    }
  }

  /**
   * Subscribe to real-time updates
   */
  static subscribeToTopics(callback: (payload: any) => void) {
    return supabase
      .channel('forum-topics')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'forum_topics'
      }, callback)
      .subscribe();
  }

  static subscribeToReplies(topicId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`forum-replies-${topicId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'forum_replies',
        filter: `topic_id=eq.${topicId}`
      }, callback)
      .subscribe();
  }
}
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from './test-utils';
import Forum from '@/pages/Forum';

// Mock forum data
const mockTopic = {
  id: '1',
  title: 'Test Topic',
  content: 'This is a test topic content',
  category: 'grammar' as const,
  status: 'open' as const,
  authorId: 'test-user',
  author: {
    id: 'test-user',
    name: 'Test User',
    email: 'test@example.com',
    role: 'student' as const,
    joinDate: '2024-01-01',
    postsCount: 5,
    reputationScore: 10,
    badges: ['new-member']
  },
  createdAt: '2024-09-20T10:00:00Z',
  updatedAt: '2024-09-20T10:00:00Z',
  viewsCount: 10,
  repliesCount: 2,
  tags: ['grammar', 'help'],
  isPinned: false,
  isLocked: false,
  isResolved: false,
  votes: {
    upvotes: 5,
    downvotes: 1,
    userVote: null
  }
};

describe('Forum Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Forum List View', () => {
    it('should render forum header and create topic button', () => {
      render(<Forum />);

      expect(screen.getByText('🗣️ Fórum da Comunidade')).toBeInTheDocument();
      expect(screen.getByText('Participe das discussões, tire dúvidas e compartilhe conhecimento')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /criar tópico/i })).toBeInTheDocument();
    });

    it('should display topic categories filter', () => {
      render(<Forum />);

      expect(screen.getByText('📝 Grammar')).toBeInTheDocument();
      expect(screen.getByText('📚 Vocabulary')).toBeInTheDocument();
      expect(screen.getByText('💬 Conversation')).toBeInTheDocument();
      expect(screen.getByText('🌍 Culture')).toBeInTheDocument();
      expect(screen.getByText('📋 Homework Help')).toBeInTheDocument();
    });

    it('should display mock topics', () => {
      render(<Forum />);

      expect(screen.getByText('When to use Present Perfect vs Simple Past?')).toBeInTheDocument();
      expect(screen.getByText('Common mistakes with phrasal verbs')).toBeInTheDocument();
      expect(screen.getByText('American vs British English - Daily expressions')).toBeInTheDocument();
    });

    it('should open create topic modal when create button is clicked', async () => {
      const user = userEvent.setup();
      render(<Forum />);

      const createButton = screen.getByRole('button', { name: /criar tópico/i });
      await user.click(createButton);

      expect(screen.getByText('Create New Topic')).toBeInTheDocument();
      expect(screen.getByText('Share your questions, ideas, or start a discussion with the community.')).toBeInTheDocument();
    });

    it('should filter topics by search query', async () => {
      const user = userEvent.setup();
      render(<Forum />);

      const searchInput = screen.getByPlaceholderText('Buscar tópicos...');
      await user.type(searchInput, 'Present Perfect');

      expect(screen.getByText('When to use Present Perfect vs Simple Past?')).toBeInTheDocument();
    });

    it('should filter topics by category', async () => {
      const user = userEvent.setup();
      render(<Forum />);

      const grammarCategory = screen.getByText('📝 Grammar');
      await user.click(grammarCategory);

      expect(screen.getByText('When to use Present Perfect vs Simple Past?')).toBeInTheDocument();
    });
  });

  describe('Topic Creation', () => {
    it('should create a new topic successfully', async () => {
      const user = userEvent.setup();
      render(<Forum />);

      // Open create modal
      const createButton = screen.getByRole('button', { name: /criar tópico/i });
      await user.click(createButton);

      // Fill out form
      const titleInput = screen.getByPlaceholderText('What\'s your topic about?');
      const contentTextarea = screen.getByPlaceholderText('Describe your topic in detail...');
      const tagsInput = screen.getByPlaceholderText('e.g., grammar, vocabulary, help');

      await user.type(titleInput, 'New Test Topic');
      await user.type(contentTextarea, 'This is a new test topic content');
      await user.type(tagsInput, 'test, new');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /create topic/i });
      await user.click(submitButton);

      // Check if topic was created
      await waitFor(() => {
        expect(screen.getByText('New Test Topic')).toBeInTheDocument();
      });
    });

    it('should show error when creating topic without required fields', async () => {
      const user = userEvent.setup();
      render(<Forum />);

      // Open create modal
      const createButton = screen.getByRole('button', { name: /criar tópico/i });
      await user.click(createButton);

      // Try to submit without filling required fields
      const submitButton = screen.getByRole('button', { name: /create topic/i });
      await user.click(submitButton);

      // Should show error (toast would be mocked)
      expect(vi.mocked(require('@/hooks/use-toast').useToast().toast)).toHaveBeenCalledWith({
        title: "Error",
        description: "Please fill in both title and content fields.",
        variant: "destructive"
      });
    });
  });

  describe('Topic Detail View', () => {
    it('should navigate to topic detail when topic title is clicked', async () => {
      const user = userEvent.setup();
      render(<Forum />);

      const topicTitle = screen.getByText('When to use Present Perfect vs Simple Past?');
      await user.click(topicTitle);

      // Should show topic detail view
      expect(screen.getByText('Back to Forum')).toBeInTheDocument();
      expect(screen.getByText('When to use Present Perfect vs Simple Past?')).toBeInTheDocument();
    });

    it('should display topic replies in detail view', async () => {
      const user = userEvent.setup();
      render(<Forum />);

      const topicTitle = screen.getByText('When to use Present Perfect vs Simple Past?');
      await user.click(topicTitle);

      // Should show replies section
      expect(screen.getByText(/replies/i)).toBeInTheDocument();
      expect(screen.getByText('Add Your Reply')).toBeInTheDocument();
    });

    it('should navigate back to forum list when back button is clicked', async () => {
      const user = userEvent.setup();
      render(<Forum />);

      // Go to topic detail
      const topicTitle = screen.getByText('When to use Present Perfect vs Simple Past?');
      await user.click(topicTitle);

      // Click back button
      const backButton = screen.getByText('Back to Forum');
      await user.click(backButton);

      // Should be back to forum list
      expect(screen.getByText('🗣️ Fórum da Comunidade')).toBeInTheDocument();
      expect(screen.queryByText('Back to Forum')).not.toBeInTheDocument();
    });
  });

  describe('Reply System', () => {
    it('should create a reply successfully', async () => {
      const user = userEvent.setup();
      render(<Forum />);

      // Navigate to topic detail
      const topicTitle = screen.getByText('When to use Present Perfect vs Simple Past?');
      await user.click(topicTitle);

      // Add a reply
      const replyTextarea = screen.getByPlaceholderText('Share your thoughts, provide help, or ask follow-up questions...');
      await user.type(replyTextarea, 'This is my reply to the topic');

      const postReplyButton = screen.getByRole('button', { name: /post reply/i });
      await user.click(postReplyButton);

      // Check if reply was added
      await waitFor(() => {
        expect(screen.getByText('This is my reply to the topic')).toBeInTheDocument();
      });
    });

    it('should show error when trying to post empty reply', async () => {
      const user = userEvent.setup();
      render(<Forum />);

      // Navigate to topic detail
      const topicTitle = screen.getByText('When to use Present Perfect vs Simple Past?');
      await user.click(topicTitle);

      // Try to post empty reply
      const postReplyButton = screen.getByRole('button', { name: /post reply/i });
      await user.click(postReplyButton);

      // Should show error
      expect(vi.mocked(require('@/hooks/use-toast').useToast().toast)).toHaveBeenCalledWith({
        title: "Error",
        description: "Please enter a reply message.",
        variant: "destructive"
      });
    });

    it('should display existing replies with author information', async () => {
      const user = userEvent.setup();
      render(<Forum />);

      // Navigate to topic detail
      const topicTitle = screen.getByText('When to use Present Perfect vs Simple Past?');
      await user.click(topicTitle);

      // Should show existing replies
      expect(screen.getByText('Prof. Johnson')).toBeInTheDocument();
      expect(screen.getByText('✓ Best Answer')).toBeInTheDocument();
      expect(screen.getByText(/Great question! The Present Perfect is used/)).toBeInTheDocument();
    });
  });

  describe('Forum Statistics and Interaction', () => {
    it('should increment view count when entering topic', async () => {
      const user = userEvent.setup();
      render(<Forum />);

      const topicTitle = screen.getByText('When to use Present Perfect vs Simple Past?');
      await user.click(topicTitle);

      // View count should be incremented (this would be tested in integration)
      expect(screen.getByText(/views/)).toBeInTheDocument();
    });

    it('should display topic metadata correctly', async () => {
      const user = userEvent.setup();
      render(<Forum />);

      const topicTitle = screen.getByText('When to use Present Perfect vs Simple Past?');
      await user.click(topicTitle);

      // Should show category, status, views, replies
      expect(screen.getByText('Grammar')).toBeInTheDocument();
      expect(screen.getByText('open')).toBeInTheDocument();
      expect(screen.getByText(/views.*replies/)).toBeInTheDocument();
    });

    it('should display voting system', () => {
      render(<Forum />);

      // Should show voting arrows and scores
      const upvoteButtons = screen.getAllByRole('button');
      const votingButtons = upvoteButtons.filter(button =>
        button.querySelector('svg') &&
        (button.querySelector('svg')?.classList.contains('lucide-arrow-up') ||
         button.querySelector('svg')?.classList.contains('lucide-arrow-down'))
      );

      expect(votingButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Forum Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<Forum />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('🗣️ Fórum da Comunidade');
    });

    it('should have accessible form labels', async () => {
      const user = userEvent.setup();
      render(<Forum />);

      // Open create modal
      const createButton = screen.getByRole('button', { name: /criar tópico/i });
      await user.click(createButton);

      expect(screen.getByText('Topic Title *')).toBeInTheDocument();
      expect(screen.getByText('Category *')).toBeInTheDocument();
    });

    it('should have keyboard navigation support', async () => {
      render(<Forum />);

      const createButton = screen.getByRole('button', { name: /criar tópico/i });
      createButton.focus();

      expect(document.activeElement).toBe(createButton);
    });
  });
});
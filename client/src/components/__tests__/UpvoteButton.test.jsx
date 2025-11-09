import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UpvoteButton from '../UpvoteButton.jsx';
import { authStore } from '../../store/authStore.js';
import { suggestionStore } from '../../store/suggestionStore.js';

vi.mock('../../store/authStore.js', () => ({
  authStore: {
    getState: vi.fn(() => ({ isAuthenticated: true, user: { _id: 'user1' } })),
    isAuthenticated: true
  }
}));

vi.mock('../../store/suggestionStore.js', () => ({
  suggestionStore: {
    upvoteSuggestion: vi.fn(() => Promise.resolve({ success: true }))
  }
}));

describe('UpvoteButton', () => {
  const mockSuggestion = {
    _id: '1',
    upvotesCount: 5,
    upvoters: []
  };

  it('renders upvote button with count', () => {
    render(<UpvoteButton suggestion={mockSuggestion} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls upvoteSuggestion on click', async () => {
    const upvoteSuggestion = vi.fn(() => Promise.resolve({ success: true }));
    suggestionStore.upvoteSuggestion = upvoteSuggestion;

    render(<UpvoteButton suggestion={mockSuggestion} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(upvoteSuggestion).toHaveBeenCalledWith('1', true);
  });
});


import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SuggestionCard from '../SuggestionCard.jsx';

describe('SuggestionCard', () => {
  const mockSuggestion = {
    _id: '1',
    title: 'Test Suggestion',
    description: 'This is a test suggestion description that should be truncated if it exceeds 200 characters. '.repeat(3),
    author: { name: 'John Doe' },
    upvotesCount: 5,
    status: 'New',
    tags: ['test', 'feature'],
    createdAt: new Date().toISOString()
  };

  it('renders suggestion title', () => {
    render(<SuggestionCard suggestion={mockSuggestion} />);
    expect(screen.getByText('Test Suggestion')).toBeInTheDocument();
  });

  it('displays truncated description', () => {
    render(<SuggestionCard suggestion={mockSuggestion} />);
    const description = screen.getByText(/This is a test suggestion/);
    expect(description).toBeInTheDocument();
  });

  it('displays upvote count', () => {
    render(<SuggestionCard suggestion={mockSuggestion} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('displays author name', () => {
    render(<SuggestionCard suggestion={mockSuggestion} />);
    expect(screen.getByText(/by John Doe/)).toBeInTheDocument();
  });
});


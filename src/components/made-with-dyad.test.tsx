import { render, screen } from '@testing-library/react';
import { MadeWithDyad } from './made-with-dyad';

describe('MadeWithDyad', () => {
  it('renders the link', () => {
    render(<MadeWithDyad />);
    const linkElement = screen.getByText(/Made with Dyad/i);
    expect(linkElement).toBeInTheDocument();
  });
});

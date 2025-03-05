import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { useNavigate } from 'react-router-dom';
import TryButton from '@/components/customui/TryButton';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('TryButton Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
     localStorage.removeItem('token');
    mockNavigate.mockClear();
    useNavigate.mockReturnValue(mockNavigate); 
  });

  it('renders the Try Now button', () => {
    render(
      <BrowserRouter>
        <TryButton />
      </BrowserRouter>
    );
    expect(screen.getByText('Try Now')).toBeInTheDocument(); 
  });

  it('navigates to /dashboard when token is present', () => {
    localStorage.setItem('token', 'testToken');

    render(
      <BrowserRouter>
        <TryButton />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Try Now')); 
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard'); 
  });

  it('navigates to /login when no token is present', () => {
    render(
      <BrowserRouter>
        <TryButton />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Try Now'));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('does not navigate on render without button click', () => {
    render(
      <BrowserRouter>
        <TryButton />
      </BrowserRouter>
    );
    expect(mockNavigate).not.toHaveBeenCalled(); 
  });
});

 
import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/customui/Footer';


describe('Footer Component', () => {
  it('renders the footer with correct text', () => {
    render(<Footer />);
     
    expect(screen.getByText(/all rights reserved @ presto 2024/i)).toBeInTheDocument();
  });
});

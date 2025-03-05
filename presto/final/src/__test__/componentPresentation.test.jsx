import PresentationComponent from '@/components/customui/PresentationComponent';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';


describe('PresentationComponent', () => {
  const item = {
    id: '1',
    name: 'Test Presentation',
    description: 'This is a test description',
    thumbnail: 'https://picsum.photos/id/1/200/300',
    slides: [{ id: 1 }, { id: 2 }]
  };

  const itemWithoutThumbnail = {
    id: '2',
    name: 'No Thumbnail',
    description: 'Description without thumbnail',
    slides: []
  };

  const renderComponent = (itemProp) => {
    render(
      <BrowserRouter>
        <PresentationComponent item={itemProp} />
      </BrowserRouter>
    );
  };

  it('renders the component with correct name, description, and slide count', () => {
    renderComponent(item);
    expect(screen.getByText('Test Presentation')).toBeInTheDocument();
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders link with correct href', () => {
    renderComponent(item);
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', '/dashboard/1');
  });

  it('applies background image when thumbnail is provided', () => {
    renderComponent(item);
    const divElement = screen.getByText('Test Presentation').parentElement;
    expect(divElement).toHaveStyle(`background-image: url(${item.thumbnail})`);
    expect(divElement).toHaveStyle('background-color: rgba(0, 0, 0, 0)');
  });

  it('applies gray background color when no thumbnail is provided', () => {
    renderComponent(itemWithoutThumbnail);
    const divElement = screen.getByText('No Thumbnail').parentElement;
    expect(divElement).toHaveStyle('background-color: rgb(128, 128, 128)');
    expect(divElement).not.toHaveStyle(`background-image: url(${item.thumbnail})`);
  });

  it('shows slide count as 1 when slides array is empty', () => {
    renderComponent(itemWithoutThumbnail);
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});

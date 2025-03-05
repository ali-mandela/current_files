import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

const TryButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <Button onClick={handleClick} className='w-max bg-main text-xl font-light'>
      Try Now
    </Button>
  );
};

export default TryButton;

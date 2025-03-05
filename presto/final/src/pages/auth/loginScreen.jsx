import OuterLayout from '@/components/customui/OuterLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input'; 
import { fetchStoreData } from '@/helper/fetchApi';
import useStoreHook from '@/hooks/useStoreHook';
import axios from 'axios';
import {   useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const LoginScreen = () => {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setGlobalStorage } = useStoreHook(); 




  

  async function handleLogin(e) {
    e.preventDefault();
    const { email, password } = formState;
    if (!email || !password) {
      toast.error('All fields are required.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post('/admin/auth/login', { email, password });

      if (res.status === 200) {
        localStorage.setItem('token', JSON.stringify(res?.data?.token));
        toast.success('Logged in successfully');
        await fetchStoreData(setGlobalStorage);
        navigate('/dashboard');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLogin(e);
    }
  }

  return (
    <OuterLayout>
      <div onKeyDown={handleKeyDown} className='mx-auto m-12 w-full sm:w-[300px]'>
        <Card>
          <CardHeader>
            <CardTitle className='text-center text-2xl'>Login Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className='my-2'>
                <label htmlFor="email" className='text-sm mb-1 text-slate-400 lowercase'>
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  type="email"
                  placeholder="Email"
                />
              </div>
              <div className='my-2'>
                <label htmlFor="password" className='text-sm mb-1 text-slate-400 lowercase'>
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  value={formState.password}
                  onChange={handleInputChange}
                  type="password"
                  placeholder="Password"
                />
              </div>
              <div className='mx-auto text-center'>
                <Button className='w-full' type="submit" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <p className='text-center mx-auto'>
              New User?{" "}
              <Link className='text-main' to='/register'>
                Register now.
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </OuterLayout>
  );
};

export default LoginScreen;

import   { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import toast from 'react-hot-toast';
import useStoreHook from '@/hooks/useStoreHook';
const Navbar = () => {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const {syncStoreDataLogout} = useStoreHook();

  useEffect(()=>{
    if(!token){
      const res = JSON.parse(localStorage.getItem('token'));
      setToken(res);  
    }
  },[token]);
  async function handleLogout(){ 
    const ttoken = JSON.parse(localStorage.getItem('token'));
    await syncStoreDataLogout();  
    try {
      const res = await axios.post('/admin/auth/logout',{ 
      }, {
        headers :{
          Authorization: `Bearer ${ttoken}`
        }
      }); 
      if(res.status === 200){ 
        localStorage.clear(); 
        toast.success('logged out succesfully');
        navigate('/')
      }        
    } catch (error) {
      toast.error('Logout failed');
      toast.error(error.response?.data?.error || error.message);
    } 
  }
  return (
    <nav className='h-[60px] px-2 md:px-8 bg-slate-200 flex items-center justify-between'>
      <Link to={'/'}><h1 className=' text-3xl md:text-4xl font-semibold italic'>Presto</h1></Link>
      <ul className='flex gap-2 items-center md:gap-4'>
        {
          token ? (<><li><Link className='text-md md:text-lg hover:underline ' to='/dashboard'>Dashboard</Link></li><li><Button data-cy="l-out" onClick={handleLogout} >Logout</Button></li></>) : (<><li><Link to='/login'><Button className='hover:bg-main hover:text-white' variant='secondary'>Login</Button></Link></li><li><Link to='/register'><Button className='bg-main'>Register</Button></Link></li></>)
        }
      </ul>
    </nav>
  )
}

export default Navbar
import OuterLayout from '@/components/customui/OuterLayout'
import {Input} from '@/components/ui/input';
import {useState} from 'react';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Link, useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import toast from 'react-hot-toast';
import axios from 'axios';
import useStoreHook from '@/hooks/useStoreHook';
import { fetchStoreData } from '@/helper/fetchApi';

const RegisterScreen = () => {
  const [formData,
    setFormData] = useState({name: "", email: "", password: ""});
  const [cPassword,
    setcPassword] = useState('');
  const navigate = useNavigate();
  const { setGlobalStorage } = useStoreHook();

  async function handleSubmit(e) {
    e.preventDefault(); 
    const {name, email, password} = formData;
    if(!name || !email || !password || !cPassword){
      toast.error('All the fields are required.');
      return;
    }
    if(formData.password !== cPassword){
      toast.error('password and confirm password are not same.');
      return;
    }

    try {

      const res = await axios.post('/admin/auth/register',{
        name, email, password
      }); 
      if(res.status === 200){
        localStorage.setItem('token', JSON.stringify(res?.data?.token));
        await fetchStoreData(setGlobalStorage);
        toast.success('registred succesfully');
        navigate('/dashboard')

      } 
      
    } catch (error) { 
      toast.error(error.response?.data?.error || error.message)
    } 

        

  }

  const handleInputChange = (e) => {
    const {name, value} = e.target; 
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <OuterLayout >
      <div onKeyDown={handleKeyDown} className='mx-auto m-12 w-[300px]'>

        <Card>
          <CardHeader>
            <CardTitle className='text-center text-2xl'>Register form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className='my-2'>
                <label className='text-sm mb-1 text-slate-400 lowercase '>Name</label>
                <Input
                  value={formData.name}
                  onChange={handleInputChange}
                  name="name"
                  type="text"
                  placeholder="Name"/>
              </div>
              <div className='my-2'>
                <label className='text-sm mb-1 text-slate-400 lowercase '>Email</label>

                <Input
                  value={formData.email}
                  onChange={handleInputChange}
                  name="email"
                  type="email"
                  placeholder="Email"/>
              </div>
              <div className='my-2'>
                <label className='text-sm mb-1 text-slate-400 lowercase '>Password</label>

                <Input
                  value={formData.password}
                  onChange={handleInputChange}
                  type="password"
                  name="password"
                  placeholder="Password"/>
              </div>
              <div className='my-2'>
                <label className='text-sm mb-1 text-slate-400 lowercase '>confirm password</label>

                <Input value={cPassword} name='confirm password' onChange={(e)=>setcPassword(e.target.value)} type="text" placeholder="Confirm Password"/>
              </div>
              <div className='mx-auto text-center'>
                <Button type='submit' className='w-full'>
                                    register
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <p className='text-center mx-auto'>Already registered ?
              <Link className='text-main' to='/login'>{" "}login.</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </OuterLayout>
  )
}

export default RegisterScreen
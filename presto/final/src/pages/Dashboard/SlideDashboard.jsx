import OuterLayout from '@/components/customui/OuterLayout';
import  { CircleArrowLeft, } from 'lucide-react';
import {useNavigate, useParams} from 'react-router-dom'; 
import {useEffect, useState} from 'react';    
import useStoreHook from '@/hooks/useStoreHook';
import toast from 'react-hot-toast';
import {  DeletePresentationAction, EditPresentationDetailAction } from '@/components/customui/utils';
import { Button } from '@/components/ui/button';
import CustomSlides from '@/components/customui/CustomSlides';
import SLideRearrangeScreen from '../slide/rearrange/rearrangeScreen'; 


const SlideDashboard = () => {
  const {id} = useParams();
  const {deletePresentation,addSlideToPresentation,SLideRearrangeHandlerContext}  = useStoreHook();
  const [openRearrange, setOpenRearrange] = useState(false);
  const navigate = useNavigate();
  const { globalStorage } = useStoreHook();
  const [presentationData, setPresentationData] = useState({});
  const [slidesData, setslidesData] = useState([]); 
  


  useEffect(() => {
    let data = globalStorage?.presentations;
    let res = data?.filter((p) => p.id === id);
    setPresentationData(res?.[0]);  
    setslidesData(presentationData?.slides)
  }, [globalStorage, id, presentationData?.slides]);

  async function handleDelete() {

    const {success} = await deletePresentation(id);;
    if(success){
      toast.success('Presentation deleted succesfully');
      navigate('/dashboard');
    }else{
      toast.error('Error in deleting presentation ');

    } 
     
  } 

  async function handleAddSlide() {  
    const {success} = await addSlideToPresentation(id);
    if(success){
      toast.success('Slide added succesfully');
    }else{
      toast.error('Error in adding presentation ');
    }
  }

  async function handleArarnge(data) { 
    const {success} = await SLideRearrangeHandlerContext(id,data);
    if(success){
      return true
    }else{
      return false;
    }
    
    
  }

  

  

  return (
    <OuterLayout>
      <div className='my-2 flex justify-between'>
        <CircleArrowLeft onClick={() =>  navigate('/dashboard')} color='blue'/>
        <DeletePresentationAction  handleDelete={handleDelete} /> 
      </div>
      <div className='my-2 items-center'>
        <p className='text-xl font-medium text-main '>{presentationData?.name} </p>
        <p className='text-sm font-light'>{presentationData?.description} </p> 
      </div>
      <div>
        <h1>Action tabs</h1>
        <div className='flex gap-4 items-center my-2'>
          <EditPresentationDetailAction data={presentationData} id={id}/>
          <Button data-cy="add-s-o" onClick={()=>handleAddSlide()} className='bg-neutral-400 px-2 h-max hover:text-white text-black text-[10px]'>Add Slide</Button>
          <Button onClick={()=>setOpenRearrange(true)} className='bg-green-400 px-2 h-max hover:text-white text-black text-[10px]'>Rearrange Slide</Button>
          <div>
            <SLideRearrangeScreen onSave={handleArarnge}   data={slidesData} open={openRearrange} setOpen={setOpenRearrange} />
          </div>
         
         
        </div>
      </div>
      <hr  className='my-6'/>
      <CustomSlides slidesData={slidesData} id={id}/>
    </OuterLayout>
  )
}

export default SlideDashboard;
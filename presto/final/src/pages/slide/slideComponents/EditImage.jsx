import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent, 
  DialogFooter,
  DialogHeader,
  DialogTitle, 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import toast from "react-hot-toast"; 
import useStoreHook from "@/hooks/useStoreHook"; 

const EditImage = ({ isPopoverOpen, setIsPopoverOpen, pId, sIndex, data }) => { 
  const [elementData, setElementData] = useState(data);
  const { handleSlideItemEdit } = useStoreHook();

  const handleEditSlideItem = async () => {

    if(elementData?.zIndex >10){
      toast.error('Z index - layer value cannot be greater then 10')
      return;
    }

    
    const { success } = await handleSlideItemEdit(pId, sIndex, elementData.id, 'image', elementData); 
    if (success) {
      toast.success('Image element changed successfully');
    } else {
      toast.error('Error in editing image element.');
    }
    setIsPopoverOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setElementData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

 

  return (
    <div>
      <Dialog className=' z-[9999]'  open={isPopoverOpen} onOpenChange={setIsPopoverOpen}> 
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Image Element</DialogTitle> 
          </DialogHeader> 
          <div>
            <div className="">
              <label className="text-sm text-slate-400">Image URL</label> 
              <Input
                value={elementData?.url}
                onChange={handleInputChange}
                type="text"
                name="url"
                className='text-sm'
                placeholder="Image URL"
              />
            </div>
            <div className="my-1">
              <label className="text-sm text-slate-400">Alt Text</label>
              <Input
                value={elementData?.altname}
                onChange={handleInputChange}
                type="text"
                name="altname"
                className='text-sm'
                placeholder="Alt Text"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">Layer</label>
              <Input
                value={elementData?.zIndex}
                onChange={handleInputChange}
                type="number"
                name="zIndex"
                className='text-sm'
                placeholder="Z index"
              />
            </div>
            
          </div>
          <DialogFooter>
            <Button onClick={handleEditSlideItem}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditImage;

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent, 
  DialogFooter,
  DialogHeader,
  DialogTitle, 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch"; // Assume there's a Switch component for boolean toggles
import { useState } from "react";
import toast from "react-hot-toast";
import useStoreHook from "@/hooks/useStoreHook"; 

const EditVideo = ({ isPopoverOpen, setIsPopoverOpen, pId, sIndex, data }) => { 
  const [elementData, setElementData] = useState(data);
  const { handleSlideItemEdit } = useStoreHook();

  const handleEditSlideItem = async () => {
    if(elementData?.zIndex >10){
      toast.error('Z index - layer value cannot be greater then 10')
      return;
    }
    const { success } = await handleSlideItemEdit(pId, sIndex, elementData.id, 'video', elementData); 
    if (success) {
      toast.success('Video element changed successfully');
    } else {
      toast.error('Error in editing video element.');
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

  // const handlePositionChange = (axis, value) => {
  //   setElementData((prevState) => ({
  //     ...prevState,
  //     position: {
  //       ...prevState.position,
  //       [axis]: Number(value),
  //     },
  //   }));
  // };

  const handleToggleAutoplay = () => {
    setElementData((prevState) => ({
      ...prevState,
      autoplay: !prevState.autoplay,
    }));
  };

  return (
    <div>
      <Dialog className=' z-[9999]'  open={isPopoverOpen} onOpenChange={setIsPopoverOpen}> 
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Video Element</DialogTitle> 
          </DialogHeader> 
          <div>
            <div className="">
              <label className="text-sm text-slate-400">Video URL</label> 
              <Input
                value={elementData?.url}
                onChange={handleInputChange}
                type="text"
                name="url"
                className='text-sm'
                placeholder="Video URL"
              />
            </div>
            {/* <div className="my-1">
              <label className="text-sm text-slate-400">Size</label>
              <Input
                value={elementData?.size}
                onChange={handleInputChange}
                type="text"
                name="size"
                className='text-sm'
                placeholder="Video Size (e.g., 200)"
              />
            </div> */}
            <div className="my-1">
              <label className="text-sm text-slate-400">Alt Text</label>
              <Input
                value={elementData?.alt}
                onChange={handleInputChange}
                type="text"
                name="alt"
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
            <div className="my-1 flex items-center">
              <label className="text-sm text-slate-400 mr-2">Autoplay</label>
              <Switch checked={elementData.autoplay} onCheckedChange={handleToggleAutoplay} />
            </div>
            {/* POSITION */}
            {/* <div className="grid grid-cols-2 gap-2 my-1">
              <div>
                <label className="text-sm text-slate-400">Position from Top</label>
                <Input
                  value={elementData?.position?.y}
                  onChange={(e) => handlePositionChange('y', e.target.value)}
                  type="text"
                  name="y"
                  className='text-sm'
                  placeholder="Position from Top"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Position from Left</label>
                <Input
                  value={elementData?.position?.x}
                  onChange={(e) => handlePositionChange('x', e.target.value)}
                  type="text"
                  name="x"
                  className='text-sm'
                  placeholder="Position from Left"
                />
              </div> 
            </div> */}
          </div>
          <DialogFooter>
            <Button onClick={handleEditSlideItem}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditVideo;

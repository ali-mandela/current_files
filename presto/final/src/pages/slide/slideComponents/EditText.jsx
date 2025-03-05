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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useStoreHook from "@/hooks/useStoreHook"; 
  
const EditText = ({ isPopoverOpen, setIsPopoverOpen, pId, sIndex, data }) => {  
  
  const [elementData, setElementData] = useState(data);
  const {handleSlideItemEdit} = useStoreHook()

  const handleEditSlideItem = async () => {
    if(elementData?.zIndex >10){
      toast.error('Z index - layer value cannot be greater then 10')
      return;
    }
    const {success} = await handleSlideItemEdit(pId,sIndex,elementData.id,'text',elementData) 
    if (success) {
      toast.success('Element changed successfully');
    } else {
      toast.error('Error in editing element.');
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

  // zIndex:'1',


  const handleFontFamilyChange = (value) => {
    setElementData((prevState) => ({
      ...prevState,
      fontFamily: value,
    }));
  };

  return (
    <div>
      <Dialog className=' z-[9999]'  open={isPopoverOpen} onOpenChange={setIsPopoverOpen}> 
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Text Element</DialogTitle> 
          </DialogHeader> 
          <div>
            <div className="">
              <label className="text-sm text-slate-400">Text</label> 
              <Input
                value={elementData?.text}
                onChange={handleInputChange}
                type="text"
                name="text"
                className='text-sm'
                placeholder="Text"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 my-1">
              <div>
                <label className="text-sm text-slate-400">Font Size</label>
                <Input
                  value={elementData?.fsize}
                  onChange={handleInputChange}
                  type="text"
                  name="fsize"
                  className='text-sm'
                  placeholder="Font Size"
                />
              </div>
              {/* <div>
                <label className="text-sm text-slate-400">Text Size</label>
                <Input
                  value={elementData?.size}
                  onChange={handleInputChange}
                  type="text"
                  name="size"
                  className='text-sm'
                  placeholder="Text Area Size"
                />
              </div> */}
              <div>
                <label className="text-sm text-slate-400">Font Color</label>
                <Input
                  value={elementData?.color}
                  onChange={handleInputChange}
                  type="text"
                  name="color"
                  className='text-sm'
                  placeholder="Font Color in HEX"
                />
              </div>
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
            </div>  */}
            <div className="flex gap-2">
              <div>
                <label className="text-sm text-slate-400">Font Family</label> 
                <Select onValueChange={handleFontFamilyChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={elementData?.fontFamily || "Select Font Family"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    <SelectItem value="Courier New">Courier New</SelectItem>
                  </SelectContent>
                </Select>
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
          </div>
          <DialogFooter>
            <Button onClick={handleEditSlideItem}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditText;

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent, 
  DialogFooter,
  DialogHeader,
  DialogTitle, 
} from "@/components/ui/dialog";
import { Input} from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";

const EditCode = ({ isPopoverOpen, setIsPopoverOpen, pId, sIndex, data }) => { 
  const [elementData, setElementData] = useState(data);
  const { handleSlideItemEdit } = useStoreHook();

  const handleEditSlideItem = async () => {
    if(elementData?.zIndex >10){
      toast.error('Z index - layer value cannot be greater then 10')
      return;
    }
    const { success } = await handleSlideItemEdit(pId, sIndex, elementData.id, 'code', elementData); 
    if (success) {
      toast.success('Code element updated successfully');
    } else {
      toast.error('Error in editing code element.');
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

  const handleLanguageChange = (value) => {
    setElementData((prevState) => ({
      ...prevState,
      language: value,
    }));
  };

  return (
    <div className=" z-[9999]">
      <Dialog className=' z-[9999]'  open={isPopoverOpen} onOpenChange={setIsPopoverOpen}> 
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Code Element</DialogTitle> 
          </DialogHeader> 
          <div className="z-[9999]">
            <div className="my-1">
              <label className="text-sm text-slate-400">Code</label> 
              <Textarea
                value={elementData?.code}
                onChange={handleInputChange}
                name="code"
                className='text-sm'
                placeholder="Edit Code Snippet"
                rows={6}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 my-1">
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
            </div>
            {/* Language Selection */}
            <div className="flex gap-4">
              <div>
                <label className="text-sm text-slate-400">Language</label> 
                <Select onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={elementData?.language || "Select Language"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="c">c</SelectItem>
                    <SelectItem value="text">Plain Text</SelectItem>
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

export default EditCode;

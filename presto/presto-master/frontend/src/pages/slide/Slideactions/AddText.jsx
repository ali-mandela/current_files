import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useStoreHook from "@/hooks/useStoreHook";  
import { useState } from "react";
import toast from "react-hot-toast"; 
import { v4 as uuidv4 } from 'uuid'; 

const AddText = ({ id, index }) => {
  const initialState = {
    id: uuidv4(),
    text: "",
    fsize: '',
    size: {
      width: "",
      height: "auto"
    },
    color: "",
    position: {
      x: 0,
      y: 0
    },
    zIndex: '1',
  };
  
  const [textData, setTextData] = useState(initialState);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { addDataToSlide } = useStoreHook();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
 
    if (name === "width") {
      setTextData(prevState => ({
        ...prevState,
        size: {
          ...prevState.size,
          width: value ? parseFloat(value) : "" 
        }
      }));
    } else if (name === "height") {
      setTextData(prevState => ({
        ...prevState,
        size: {
          ...prevState.size,
          height: value || "auto"  
        }
      }));
    } else {
      setTextData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  async function handleAddElement() {
    const { text, size, fsize, color } = textData;

    // Validate required fields
    if (!text || !size.width || !fsize || !color) {
      toast.error('All fields are required');
      return;
    }

    // Add the text element using the store hook
    const { success } = await addDataToSlide(id, index, textData, 'text');

    if (success) {
      toast.success('Text element added successfully');
      setTextData(initialState); // Reset the form state
    } else {
      toast.error('Error in adding text element');
    }

    setIsDialogOpen(false); // Close dialog after adding
  }

  return ( 
    <Dialog className='z-[9999]' open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsDialogOpen(true)} className='p-0 px-1 text-[10px]' variant='outline'>Add Text</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Text Element</DialogTitle>
        </DialogHeader>
        <div>
          <label className="text-sm mb-1 text-slate-400">Size</label>
          <Input value={textData.size.width} onChange={handleInputChange} type="number" name="width" placeholder="size" />
        </div> 
        <div>
          <label className="text-sm mb-1 text-slate-400">Text</label>
          <Input value={textData.text} onChange={handleInputChange} type="text" name="text" />
        </div>
        <div>
          <label className="text-sm mb-1 text-slate-400">Font Size (em)</label>
          <Input value={textData.fsize} onChange={handleInputChange} type="number" name="fsize" />
        </div>
        <div>
          <label className="text-sm mb-1 text-slate-400">Color (HEX)</label>
          <Input value={textData.color} onChange={handleInputChange} type="text" name="color" />
        </div>
        <DialogFooter>
          <Button onClick={handleAddElement}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog> 
  );
};

export default AddText;

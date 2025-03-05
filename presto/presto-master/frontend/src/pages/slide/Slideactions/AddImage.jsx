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
import { Switch } from "@/components/ui/switch"; 
import { Label } from "@/components/ui/label"; 

const AddImage = ({ id, index }) => {
  const [imageData, setImageData] = useState({
    id: uuidv4(),
    url: "",
    altname: "",
    size: {
      width: 0,  // Initialize with numeric value
      height: "auto",
    },
    position: {
      x: 0,
      y: 0,
    },
    zIndex: '1',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFileMode, setIsFileMode] = useState(false);
  const { addDataToSlide } = useStoreHook();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle width and height separately
    if (name === 'width' || name === 'height') {
      setImageData((prevState) => ({
        ...prevState,
        size: {
          ...prevState.size,
          [name]: value,
        },
      }));
    } else {
      setImageData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSwitchToggle = (checked) => {
    setIsFileMode(checked);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file); 
      setImageData((prevState) => ({
        ...prevState,
        url: fileURL, 
      }));
    }
  };

  async function handleAddElement() {
    const { url, altname, size } = imageData;
    if (!url || !altname || !size.width) {
      toast.error('All fields are required');
      return;
    }

    const { success } = await addDataToSlide(id, index, imageData, 'image');
    if (success) {
      toast.success('Image added successfully');
      // Reset the form
      setImageData({
        id: uuidv4(),
        url: "",
        altname: "image",
        size: {
          width: 0,
          height: "auto",
        },
        position: {
          x: 0,
          y: 0,
        },
        zIndex: '1',
      });
      setIsDialogOpen(false);
    } else {
      toast.error('Error in adding image');
    }
  }

  return (
    <div>
      <Dialog className='z-[9999]' open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsDialogOpen(true)} className='p-0 px-1 text-[10px]' variant='outline'>
            Add Image
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Image Element</DialogTitle>
          </DialogHeader>
          <div className="my-2">
            <label className="text-sm mb-2 text-slate-400">Image</label>
            <br />
            <div className="flex items-center space-x-2">
              <Switch
                checked={isFileMode}
                onCheckedChange={handleSwitchToggle}
                className={`${isFileMode ? "bg-blue-600" : "bg-gray-200"} relative inline-flex items-center h-6 rounded-full w-11`}
              >
                <span className={`${isFileMode ? "translate-x-6" : "translate-x-1"} inline-block w-4 h-4 bg-white rounded-full transition-transform`} />
              </Switch>
              <Label htmlFor="file-upload">Local Upload</Label>
            </div>
            {isFileMode ? (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange} 
                className="mt-2 p-2 border border-gray-300 rounded-md"
              />
            ) : (
              <Input
                value={imageData.url}
                onChange={handleInputChange}
                type="text"
                name="url"
                placeholder="Image link of the presentation"
                className="mt-2"
              />
            )}
          </div>
          <div>
            <label className="text-sm mb-1 text-slate-400">Alt Text</label>
            <Input value={imageData.altname} onChange={handleInputChange} type="text" name="altname" />
          </div>
          <div>
            <label className="text-sm mb-1 text-slate-400">Width</label>
            <Input value={imageData.size.width} onChange={handleInputChange} type="number" name="width" />
          </div>
          <DialogFooter>
            <Button onClick={handleAddElement}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddImage;

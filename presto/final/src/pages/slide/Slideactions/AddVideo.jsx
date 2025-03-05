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

const AddVideo = ({ id, index }) => {
  const initialVideoData = {
    id: uuidv4(),
    url: "",
    size: {
      width: "",
      height: "auto"
    },
    alt: "",
    autoplay: false,
    position: {
      x: 0,
      y: 0,
    },
    zIndex: '1',
  };

  const [videoData, setVideoData] = useState(initialVideoData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFileMode, setIsFileMode] = useState(false);
  const { addDataToSlide } = useStoreHook();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.');
      setVideoData(prevState => ({
        ...prevState,
        [parentKey]: {
          ...prevState[parentKey],
          [childKey]: value,
        },
      }));
    } else {
      setVideoData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setVideoData(prevState => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);  
      setVideoData(prevState => ({
        ...prevState,
        url: fileURL,  
      }));
    }
  };

  async function handleAddElement() {
    const { url, size } = videoData;
    // Validate URL and size
    if (!url) {
      toast.error('URL is required');
      return;
    }

    if (!size.width || isNaN(size.width)) {
      toast.error('Valid width  are required');
      return;
    }

    const { success } = await addDataToSlide(id, index, videoData, 'video');
    setIsDialogOpen(false);

    if (success) {
      toast.success('Video added successfully');
      setVideoData(initialVideoData); // Reset the form
    } else {
      toast.error('Error in adding video');
    }
  }

  return (
    <Dialog className='z-[9999]' open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsDialogOpen(true)} className='p-0 px-1 text-[10px]' variant='outline'>Add Video</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Video Element</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <label className="text-sm mb-1 text-slate-400">Local Upload</label>
          <input
            type="checkbox"
            checked={isFileMode}
            onChange={() => setIsFileMode(prev => !prev)}
            className="ml-2"
          />
        </div>
        {isFileMode ? (
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}  
            className="mt-2 p-2 border border-gray-300 rounded-md"
          />
        ) : (
          <div>
            <label className="text-sm mb-1 text-slate-400">Video URL</label>
            <Input value={videoData.url} onChange={handleInputChange} type="text" name="url" />
          </div>
        )}
        <div>
          <label className="text-sm mb-1 text-slate-400">Size </label>
          <div className="flex space-x-2">
            <Input 
              value={videoData.size.width} 
              onChange={handleInputChange} 
              type="number" 
              name="size.width" 
              placeholder="Width"
            />
          </div>
        </div>
        <div>
          <label className="text-sm mb-1 text-slate-400">Alt name</label>
          <Input value={videoData.alt} onChange={handleInputChange} type="text" name="alt" />
        </div>
        <div>
          <label className="text-sm mb-1 text-slate-400">Autoplay</label>
          <input type="checkbox" name="autoplay" checked={videoData.autoplay} onChange={handleCheckboxChange} />
        </div>
        <DialogFooter>
          <Button onClick={handleAddElement}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddVideo;

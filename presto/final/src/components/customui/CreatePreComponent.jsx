import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '../ui/input';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid'; 
import useStoreHook from '@/hooks/useStoreHook';
import { useNavigate } from 'react-router-dom';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

const CreatePreComponent = () => {
  const [presentationData, setPresentationData] = useState({
    id: uuidv4(),
    name: "",
    thumbnail: "",
    description: "",
    slides: [],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { addPresentation } = useStoreHook(); 
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPresentationData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  async function handleAddPresentation(e) {
    e.preventDefault();
    const { name } = presentationData; 
    if (!name) {
      toast.error('Name is required');
      return;
    }

    const { success } = await addPresentation(presentationData);
    if (success) {
      toast.success('Presentation added successfully');
      setPresentationData({
        id: uuidv4(),
        name: "",
        thumbnail: "",
        description: "",
        slides: [],
      })
    } else {
      toast.error('Error in adding presentation');
    }
    
    setIsDialogOpen(false);  
    navigate(`/dashboard`);
  }

  const [isFileMode, setIsFileMode] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange({ target: { name: "thumbnail", value: reader.result } });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSwitchToggle = () => {
    setIsFileMode((prev) => !prev);
    if (isFileMode) {
      handleInputChange({ target: { name: "thumbnail", value: "" } });
    }
  };
  
  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
                   
            className="w-full bg-main text-white"
            variant="outline"
           
          >
            <p  data-cy="new-presentation"     onClick={() => setIsDialogOpen(true)}>New Presentation</p>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Please fill out the details of the Presentation</DialogTitle>
            <DialogDescription>
              <div className="p-4">
                <div>
                  <div className="my-2">
                    <label className="text-sm mb-2 text-slate-400">Title</label>
                    <Input
                      value={presentationData.name}
                      onChange={handleInputChange}
                      type="text"
                      name="name"
                      placeholder="Title of the presentation"
                    />
                  </div>
                  
                  <div className="my-2">
                    <label className="text-sm mb-2 text-slate-400">Thumbnail </label>
                    <br />
                    <div className="flex items-center space-x-2">
                      {/* Switch between file system or link */}
                      <Switch
                        checked={isFileMode}
                        onCheckedChange={handleSwitchToggle}
                        className={`${
                          isFileMode ? "bg-blue-600" : "bg-gray-200"
                        } relative inline-flex items-center h-6 rounded-full w-11`}
                      >
                        <span
                          className={`${
                            isFileMode ? "translate-x-6" : "translate-x-1"
                          } inline-block w-4 h-4 bg-white rounded-full transition-transform`}
                        />
                      </Switch>
                      <Label htmlFor="airplane-mode">File machine</Label>
                    </div>
                    {/* Conditional rendering based on the mode */}
                    {isFileMode ? (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-2 p-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <Input
                        value={presentationData.thumbnail}
                        onChange={handleInputChange}
                        type="text"
                        name="thumbnail"
                        placeholder="Image link of the presentation"
                        className="mt-2"
                      />
                    )}
                  </div>
                  
                  <div className="my-2">
                    <label className="text-sm mb-2 text-slate-400">Description</label>
                    <Input
                      value={presentationData.description}
                      onChange={handleInputChange}
                      type="text"
                      name="description"
                      placeholder="Description of the presentation"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <Button
                      data-cy="c-new-p"
                      onClick={handleAddPresentation}
                      className="bg-main text-white"
                    >
                      Create
                    </Button>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePreComponent;

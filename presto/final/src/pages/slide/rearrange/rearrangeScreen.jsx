import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from 'react-hot-toast';
import { useEffect } from 'react';

// Control Panel Button Component
export const SlideRearrangeButton = ({ onClick }) => (
  <Button onClick={onClick} className="flex items-center gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
    Rearrange Slides
  </Button>
);

const SlideRearrangeScreen = ({  open, setOpen, data=[], onSave }) => {

   
  const [slides, setSlides] = useState([...data]);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(()=>{
    if(data.length!==0){
      setSlides([...data])
    }
  },[data, data.length] )

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const newSlides = [...slides];
    const draggedSlide = newSlides[draggedItem];

    // Remove the dragged item
    newSlides.splice(draggedItem, 1);
    // Insert it at the new position
    newSlides.splice(dropIndex, 0, draggedSlide);

    setSlides(newSlides);
    setDraggedItem(null);
  };

  const handleSave = async () => {
    // console.log(slides);
    
    try { 
      const res = await onSave(slides);
      if(res){
        toast.success("Slides rearranged successfully");
        setOpen(false);
      }else{
        toast.error("Failed to save slide arrangement");
      }
         
    } catch{
      toast.error("Failed to save slide arrangement");
    }
  };

  
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[90%] max-w-6xl mx-auto h-[90vh]">
        <DialogHeader>
          <DialogTitle>Rearrange Slides</DialogTitle>
          <DialogDescription>
            Drag and drop slides to reorder them
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {slides.map((slide, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`
                  relative aspect-video rounded-lg border-2 
                  ${draggedItem === index ? 'border-blue-500 opacity-50' : 'border-gray-200'}
                  ${draggedItem !== null && draggedItem !== index ? 'hover:border-blue-300' : ''}
                  bg-gray-300 shadow-sm hover:shadow-md transition-all cursor-move
                  flex items-center justify-center
                `}
              >
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>  
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button onClick={handleSave} type="button">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

  
 
export default SlideRearrangeScreen;

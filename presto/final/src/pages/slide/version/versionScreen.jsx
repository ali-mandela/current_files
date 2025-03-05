import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import toast from 'react-hot-toast';
import useStoreHook from '@/hooks/useStoreHook'; 

const VersionScreen = ({ open, setOpen, pId, index }) => { 
  const { UpdateVersionIndexItem, globalStorage } = useStoreHook(); 
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPresentationData = () => {
      const presentation = globalStorage?.presentations?.find((p) => p.id === pId);
      
      if (!presentation) {
        console.error("Presentation not found for pId:", pId);
        setLoading(false);  
        return;
      }
 
      const slide = presentation?.slides[index];
      if (slide) {
        setData(slide?.version || []);  
      }

      setLoading(false); 
    };

    fetchPresentationData();
  }, [pId, index, globalStorage]);

  const handleRestore = async (versionIndex) => {  
    
    const { success } =   await UpdateVersionIndexItem(pId, index, data[versionIndex]);
    if (success) {
      toast.success('Restored successfully');
    } else {
      toast.error('Error in restoring version');
    } 

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[90%] max-w-6xl mx-auto h-[90vh]">
        <DialogHeader>
          <DialogTitle>Version Control System</DialogTitle>
          <DialogDescription>
            Select a version to restore your slideshow to a previous state.
          </DialogDescription>
        </DialogHeader>

        <div>
          {loading ? (  
            <div className="flex justify-center items-center h-full">
              <p>Loading....</p>  
            </div>
          ) : (
            data.map((slideVersion, versionIndex) => (
              <div key={versionIndex} className="my-2 flex justify-between items-center">
                <span>Version {versionIndex + 1}</span>
                <Button onClick={() => handleRestore(versionIndex)} variant="primary">
                  Restore
                </Button>
              </div>
            ))
          )}
        </div>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VersionScreen;

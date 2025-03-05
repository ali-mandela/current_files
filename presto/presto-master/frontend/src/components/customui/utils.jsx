import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Images, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import useStoreHook from "@/hooks/useStoreHook";
import toast from "react-hot-toast";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

export const DeletePresentationAction = ({ handleDelete }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Trash2 data-cy="d-s" color="red" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            presentation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction data-cy="d-c" onClick={handleDelete}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const EditPresentationDetailAction = ({ data, id }) => {
  const [editData, setEditData] = useState({
    name: data?.name,
    thumbnail: data?.thumbnail,
    description: data?.description,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpen2, setIsDialogOpen2] = useState(false);
  const { EditPresentation } = useStoreHook();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  async function handleEditPresentation() {
    const { success } = await EditPresentation({ data: editData, id });

    if (success) {
      toast.success("Presentation edited successfully");
      setIsDialogOpen(false);
      setIsDialogOpen2(false);
    } else {
      toast.error("Error editing presentation");
    }
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
    <div className="flex gap-3 items-center">
      {/* Dialog for Title and Description */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Pencil
            data-cy="edit-title-icon"
            onClick={() => setIsDialogOpen(true)}
            className="cursor-pointer"
            color="#333"
            size={18}
          />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Title and Description</DialogTitle>
          </DialogHeader>
          <div>
            <div className="my-2">
              <Label className="text-sm mb-2 text-slate-400">Title</Label>
              <Input
                value={editData.name}
                onChange={handleInputChange}
                type="text"
                name="name"
                placeholder="Title of the presentation"
              />
            </div>
            <div className="my-2">
              <Label className="text-sm mb-2 text-slate-400">Description</Label>
              <Input
                value={editData.description}
                onChange={handleInputChange}
                type="text"
                name="description"
                placeholder="Description of the presentation"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditPresentation} className="bg-main text-white">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Thumbnail */}
      <Dialog open={isDialogOpen2} onOpenChange={setIsDialogOpen2}>
        <DialogTrigger asChild>
          <Images
            data-cy="edit-thumbnail-icon"
            onClick={() => setIsDialogOpen2(true)}
            className="cursor-pointer"
            color="#333"
            size={18}
          />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Thumbnail</DialogTitle>
          </DialogHeader>
          <div>
            <div className="my-2">
              <Label className="text-sm mb-2 text-slate-400">Thumbnail</Label>
              <br />
              <div className="flex items-center space-x-2">
                {/* Switch between file system or link */}
                <Switch  checked={isFileMode}
                  onCheckedChange={handleSwitchToggle} />
                <Label>File mode</Label>
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
                  value={editData.thumbnail}
                  onChange={handleInputChange}
                  type="text"
                  name="thumbnail"
                  placeholder="Thumbnail link of the presentation"
                  className="mt-2"
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              data-cy="u-t"
              onClick={handleEditPresentation}
              className="bg-main text-white"
              type="submit"
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

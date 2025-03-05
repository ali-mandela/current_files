import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from 'uuid';
import toast from "react-hot-toast";
import useStoreHook from "@/hooks/useStoreHook";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const AddCode = ({ id, index }) => {
  const [codeData, setCodeData] = useState({
    id: uuidv4(),
    code: "",
    fsize: "1em",
    size: {
      width: "",
      height: "auto"
    },
    language: "",
    zIndex: '1',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { addDataToSlide } = useStoreHook();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCodeData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Detect programming language
  const detectLanguage = (code) => {
    if (/^\s*#include|int\s+main/.test(code)) return "c";
    if (/^\s*def\s+|:\s*$/.test(code)) return "python";
    if (/^\s*(const|let|function|var)/.test(code)) return "javascript";
    return "text"; // Default to plain text if language cannot be detected
  };

  // Handle adding the code block
  async function handleAddCodeBlock() {
    const { code, size, fsize } = codeData;
    if (!code || !size.width   || !fsize) {
      toast.error("All fields are required");
      return;
    }

    const language = detectLanguage(code);
    const newCodeData = { ...codeData, language };

    const { success } = await addDataToSlide(id, index, newCodeData, 'code');
    setIsDialogOpen(false);

    if (success) {
      toast.success("Code block added successfully"); 
      setCodeData({
        id: uuidv4(),
        code: "",
        fsize: "1em",
        size: {
          width: "",
          height: "auto"
        },
        language: "",
        zIndex: '1',
      });
    } else {
      toast.error("Error in adding code block");
    }
  }

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsDialogOpen(true)} className="p-0 px-1 text-[10px]" variant="outline">Add Code</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Code Block</DialogTitle>
          </DialogHeader>
          <div>
            <label className="text-sm mb-1 text-slate-400">Width  </label>
            <Input value={codeData.size.width} onChange={(e) => setCodeData({ ...codeData, size: { ...codeData.size, width: e.target.value } })} type="number" name="width" />
          </div> 
          <div>
            <label className="text-sm mb-1 text-slate-400">Font Size (em)</label>
            <Input value={codeData.fsize} onChange={handleInputChange} type="number" name="fsize" step="0.1" />
          </div>
          <div>
            <label className="text-sm mb-1 text-slate-400">Code</label>
            <Textarea
              value={codeData.code}
              onChange={(e) => setCodeData({ ...codeData, code: e.target.value })}
              name="code"
              rows={5}
              className="whitespace-pre font-mono"
              placeholder="Enter your code here..."
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddCodeBlock}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddCode;

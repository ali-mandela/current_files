import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; 
import { Palette } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";
import useStoreHook from "@/hooks/useStoreHook";

const AddTheme = ({ id, index }) => {
  const [type, setType] = useState('imgurl');  
  const [themeValue, setThemeValue] = useState('');  
  const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const [useLocalFile, setUseLocalFile] = useState(false);  
  const [gradientColors, setGradientColors] = useState({ color1: '#ffffff', color2: '#000000' });
  const { addSlideTheme } = useStoreHook();

  const handleTypeChange = (newType) => {
    setType(newType);
    setThemeValue(''); // Reset theme value on type change
  };

  const handleThemeChange = (e) => {
    setThemeValue(e.target.value);
  };

  const handleGradientChange = (e, colorKey) => {
    setGradientColors(prevColors => ({
      ...prevColors,
      [colorKey]: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThemeValue(reader.result);  
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTheme = async () => {
    let finalThemeValue = themeValue;
    if (type === 'gradient') {
      finalThemeValue = `${gradientColors.color1}, ${gradientColors.color2}`;
    }

    if (!finalThemeValue) {
      toast('Theme value is required.');
      return;
    }

    const { success } = await addSlideTheme(id, index, {
      type,
      value: finalThemeValue
    });

    if (!success) {
      toast.error('Error in setting theme');
    }
    
    setIsDialogOpen(false)
  };

  return (
    <div>
      {/* Dialog Setup */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="flex items-center gap-1 text-main border-[1px] p-1 cursor-pointer hover:bg-sky-600 hover:text-white transition-all duration-500 rounded-md">
            <Palette />
            <p className="font-medium">Theme</p>
          </div>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Theme</DialogTitle>
          </DialogHeader>

          {/* Tabs for theme type selection */}
          <Tabs value={type} onValueChange={handleTypeChange} className="mt-4">
            <TabsList className="flex justify-around">
              <TabsTrigger value="imgurl">Image URL</TabsTrigger>
              <TabsTrigger value="solid">Solid Color</TabsTrigger>
              <TabsTrigger value="gradient">Gradient</TabsTrigger>
            </TabsList> 

            {/* Content for Image URL / File Upload */}
            <TabsContent value="imgurl">
              <Card>
                <CardHeader>
                  <CardTitle>Image URL / File Upload</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <label className="mr-2">Use Local File:</label>
                    <input
                      type="checkbox"
                      checked={useLocalFile}
                      onChange={() => setUseLocalFile(!useLocalFile)}
                      className="cursor-pointer"
                    />
                  </div>
                  {useLocalFile ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="border p-2 rounded-md w-full"
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder="Enter image URL"
                      value={themeValue}
                      onChange={handleThemeChange}
                      className="border p-2 rounded-md w-full"
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content for Solid Color */}
            <TabsContent value="solid">
              <Card>
                <CardHeader>
                  <CardTitle>Solid Color</CardTitle>
                </CardHeader>
                <CardContent>
                  <input
                    type="color"
                    value={themeValue}
                    onChange={handleThemeChange}
                    className="w-full h-10 p-2 rounded-md cursor-pointer"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content for Gradient */}
            <TabsContent value="gradient">
              <Card>
                <CardHeader>
                  <CardTitle>Gradient</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label>Start Color</label>
                      <input
                        type="color"
                        value={gradientColors.color1}
                        onChange={(e) => handleGradientChange(e, 'color1')}
                        className="w-full h-10 p-2 rounded-md cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <label>End Color</label>
                      <input
                        type="color"
                        value={gradientColors.color2}
                        onChange={(e) => handleGradientChange(e, 'color2')}
                        className="w-full h-10 p-2 rounded-md cursor-pointer"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button onClick={handleAddTheme}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddTheme;

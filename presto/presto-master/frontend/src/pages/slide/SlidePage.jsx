import useStoreHook from "@/hooks/useStoreHook";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import OuterLayout from "@/components/customui/OuterLayout";
import { CircleArrowLeft } from "lucide-react";
import AddText from "./Slideactions/AddText";
import AddVideo from "./Slideactions/AddVideo";
import AddImage from "./Slideactions/AddImage";
import AddCode from "./Slideactions/AddCode"; 
import DisplayText from "./slideComponents/DisplayText";
import DisplayCode from "./slideComponents/DisplayCode";
import DisplayImage from "./slideComponents/DisplayImage";
import DisplayVideo from "./slideComponents/DisplayVideo";
import AddTheme from "./slideComponents/AddTheme";
import { Button } from "@/components/ui/button";
import VersionScreen from "./version/versionScreen";
import toast from "react-hot-toast";

const Slide = () => {
  const { globalStorage, UpdateVersionContext } = useStoreHook();
  const { id, index } = useParams(); 
  const navigate = useNavigate();
  const [slideData, setSlideData] = useState({});
  const parentRef = useRef();
  const [openVersion, setOpenVersion] = useState(false);
 
  const [lastSave, setLastSave] = useState(Date.now());
 
  useEffect(() => {
    const presentations = globalStorage?.presentations;
    const currentPresentation = presentations?.find((presentation) => presentation.id === id);
    if (currentPresentation && currentPresentation?.slides) {
      const slideIndex = index;
      setSlideData(currentPresentation?.slides[slideIndex]);
    }
  }, [globalStorage, id, index]);
 
  useEffect(() => {
    const interval = setInterval(async () => {
      if (Date.now() - lastSave >= 60000) {  
        const {success} = await  UpdateVersionContext(id, index, slideData);  
        if(success){
          toast('Done')
        }
        setLastSave(Date.now());  
      }
    }, 60000);  

    return () => clearInterval(interval); 
  }, [slideData, lastSave, UpdateVersionContext, id, index]);

  

  return (
    <OuterLayout>
      <div className='my-2 overflow-hidden flex items-center justify-between'>
        <div className="flex items-center gap-20">
          <CircleArrowLeft className="cursor-pointer" onClick={() => navigate(`/dashboard/${id}`)} color='blue'/> 
          <AddTheme id={id} index={index} />
          <Button onClick={() => setOpenVersion(true)} className='bg-green-400 px-2 h-max hover:text-white text-black text-[10px]'>
            Version History
          </Button>
          <VersionScreen pId={id} index={index} open={openVersion} setOpen={setOpenVersion} />
        </div>
        <div className="flex gap-2">
          <AddText id={id} index={index}/>
          <AddVideo id={id} index={index}/> 
          <AddImage id={id} index={index}/>  
          <AddCode id={id} index={index}/>   
        </div>
      </div>
      <div ref={parentRef} style={{
        background:
          slideData?.details?.type === 'imgurl'
            ? `url("${slideData?.details?.value}")`
            : slideData?.details?.type === 'gradient'
              ? `linear-gradient(to bottom left, ${slideData?.details?.value})`
              : slideData?.details?.type === 'solid'
                ? slideData?.details?.value
                : 'gray',  
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        padding: "8px"
      }} className="w-full h-[400px] bg-slate-50 z-0 overflow-hidden relative">
        {slideData.text?.map((textItem) => (
          <DisplayText parentRef={parentRef} sIndex={index} pId={id} key={textItem.id} data={textItem} />   
        ))}
        {slideData.image?.map((imageItem) => (
          <DisplayImage parentRef={parentRef} sIndex={index} pId={id} key={imageItem.id} data={imageItem}/>
        ))}
        {slideData.video?.map((videoItem) => (
          <DisplayVideo parentRef={parentRef} sIndex={index} pId={id} key={videoItem.id} data={videoItem} />
        ))}
        {slideData.code?.map((codeItem) => (
          <DisplayCode parentRef={parentRef} sIndex={index} pId={id} key={codeItem.id} data={codeItem} />
        ))}
      </div>
    </OuterLayout>
  );
};

export default Slide;

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, PencilOff, X } from "lucide-react";
import useStoreHook from "@/hooks/useStoreHook";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "../ui/button";
import PreviewVideo from "@/pages/perview/PreviewDisplay/PreviewVideo";
import PreviewCode from "@/pages/perview/PreviewDisplay/PreviewCode";
import PreviewImage from "@/pages/perview/PreviewDisplay/PreviewImage";
import PreviewText from "@/pages/perview/PreviewDisplay/PreviewText";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

const CustomSlides = ({ id, slidesData = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fade, setFade] = useState(false); // State for fade effect
  const navigate = useNavigate();
  const { DeleteSlideToPresentation, deletePresentation } = useStoreHook();
  const [isOpen, setIsOpen] = useState(false);

  const handleLeftMovement = useCallback(() => {
    setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  }, []);

  const handleRightMovement = useCallback(() => {
    setSelectedIndex((prevIndex) =>
      prevIndex < slidesData.length - 1 ? prevIndex + 1 : prevIndex
    );
  }, [slidesData.length]);

  useEffect(() => {
    setFade(true); 
    const timeout = setTimeout(() => setFade(false), 1000); 
    return () => clearTimeout(timeout);
  }, [selectedIndex]);

  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === "ArrowLeft") handleLeftMovement();
      if (event.key === "ArrowRight") handleRightMovement();
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [handleLeftMovement, handleRightMovement]);

  async function handleSlideDelete(selectedIndex) {
    if (slidesData.length === 1) {
      setIsOpen(true);
      return;
    }
    const { success } = await DeleteSlideToPresentation(id, selectedIndex);
    if (success) {
      toast.success("Slide deleted successfully");
    } else {
      toast.error("Error in deleting slide");
    }
  }

  async function handlePreview(id) {
    navigate(`/preview/${id}/${selectedIndex}`);
  }

  async function handleDelete() {
    const { success } = await deletePresentation(id);
    if (success) {
      toast.success("Presentation deleted successfully");
      navigate('/dashboard');
    } else {
      toast.error("Error in deleting presentation");
    }
  }

  return (
    <div>
      <div className="flex justify-center z-10 gap-2">
        {slidesData[selectedIndex] && (
          <div
            className={`w-full bg-no-repeat relative h-[400px]  ease-in-out transition-opacity duration-1000 ${
              fade ? 'opacity-10' : 'opacity-100'
            }`}
            style={{
              background:
                slidesData[selectedIndex]?.details?.type === 'imgurl'
                  ? `url("${slidesData[selectedIndex]?.details?.value}")`
                  : slidesData[selectedIndex]?.details?.type === 'gradient'
                    ? `linear-gradient(to bottom left, ${slidesData[selectedIndex]?.details?.value})`
                    : slidesData[selectedIndex]?.details?.type === 'solid'
                      ? slidesData[selectedIndex]?.details?.value
                      : 'gray',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              zIndex: 0
            }}
          >
            {slidesData[selectedIndex].text?.map((textItem) => (
              <PreviewText
                sIndex={selectedIndex}
                pId={id}
                key={textItem.id}
                data={textItem}
              />
            ))}
            {slidesData[selectedIndex].image?.map((imageItem) => (
              <PreviewImage
                sIndex={selectedIndex}
                pId={id}
                key={imageItem.id}
                data={imageItem}
              />
            ))}
            {slidesData[selectedIndex].video?.map((videoItem) => (
              <PreviewVideo
                sIndex={selectedIndex}
                pId={id}
                key={videoItem.id}
                data={videoItem}
              />
            ))}
            {slidesData[selectedIndex].code?.map((codeItem) => (
              <PreviewCode
                sIndex={selectedIndex}
                pId={id}
                key={codeItem.id}
                data={codeItem}
              />
            ))}
            <p>{slidesData[selectedIndex]?.name}</p>
            <p className="absolute bottom-0 w-[50px] h-[50px] cursor-text font-black flex justify-center items-center text-[1em] left-0">
              {selectedIndex + 1}
            </p>
            <div className="absolute flex gap-2 -top-6 right-0">
              <Button
                onClick={() => handlePreview(id)}
                className="bg-neutral-400 px-2 h-6 hover:text-white text-black text-[10px]"
              >
                Preview Slide
              </Button>
              <p
                onClick={() => navigate(`/dashboard/${id}/${selectedIndex}`)}
                className="cursor-pointer rounded-md p-0"
              >
                <PencilOff color="green" fontSize={10} />
              </p>
              <p
                onClick={() => handleSlideDelete(selectedIndex)}
                className="cursor-pointer rounded-md p-0"
              >
                <X color="red" fontSize={14} />
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Alert Dialog for Last Slide Deletion */}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger className="hidden" />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Deleting this slide will delete the presentation.
              This action cannot be undone. This will permanently delete your presentation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Carousel Controls */}
      <div className="flex my-2 gap-3">
        {selectedIndex !== 0 && (
          <div className="w-8 h-8 hover:bg-slate-300 bg-slate-200 rounded-full flex justify-center items-center">
            <ArrowLeft onClick={handleLeftMovement} />
          </div>
        )}
        {selectedIndex < slidesData.length - 1 && slidesData.length !== 0 && (
          <div className="w-8 h-8 hover:bg-slate-300 bg-slate-200 rounded-full flex justify-center items-center">
            <ArrowRight data-cy="add-n-s" onClick={handleRightMovement} />
          </div>
        )}
      </div>

      {/* Thumbnail Preview Carousel */}
      <Carousel opts={{ align: "start" }} className="w-full max-w-screen">
        <CarouselContent className="-ml-1">
          {slidesData.map((item, idx) => (
            <CarouselItem key={idx} className="pl-1 basis-1/3 md:basis-1/6 lg:basis-1/12">
              <Card
                onClick={() => setSelectedIndex(idx)}
                className={`cursor-pointer ${
                  idx === selectedIndex ? "border-blue-500" : "border-transparent"
                }`}
              >
                <CardContent
                  className="h-[60px] relative border-2 w-full flex items-center justify-center"
                  style={{
                    backgroundImage: 
                      item?.details?.type === 'imgurl'
                        ? `url(${item?.details?.value})`
                        : item?.details?.type === 'gradient'
                          ? `linear-gradient(to bottom left, ${item?.details?.value})`
                          : "none",
                    backgroundColor: 
                      item?.details?.type === 'solid' 
                        ? `${item?.details?.value}` 
                        : "gray",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                >
                  <p className="absolute font-black w-full bottom-0 bg-slate-400 bg-opacity-50 flex justify-center items-center text-xs">
                    {idx + 1}
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default CustomSlides;

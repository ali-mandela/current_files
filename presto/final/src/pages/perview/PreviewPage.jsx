import useStoreHook from "@/hooks/useStoreHook";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PreviewText from "./PreviewDisplay/PreviewText";
import PreviewImage from "./PreviewDisplay/PreviewImage";
import PreviewVideo from "./PreviewDisplay/PreviewVideo";
import PreviewCode from "./PreviewDisplay/PreviewCode";

const PreviewPage = () => {
  const { id, index } = useParams();
  const navigate = useNavigate();
  const { globalStorage } = useStoreHook();
  const [presentation, setPresentation] = useState(null);
  const currentIndex = parseInt(index, 10);

  useEffect(() => {
    const selectedPresentation = globalStorage?.presentations?.find((i) => i.id === id);
    if (selectedPresentation && selectedPresentation.slides) {
      setPresentation(selectedPresentation);
    }
  }, [globalStorage?.presentations, id]);

  const goToSlide = useCallback((newIndex) => {
    if (newIndex >= 0 && newIndex < presentation.slides.length) {
      navigate(`/preview/${id}/${newIndex}`);
    }
  }, [id, navigate, presentation?.slides.length]);

  const handleLeftMovement = useCallback(() => {
    goToSlide(currentIndex - 1);
  },[currentIndex, goToSlide]);

  const handleRightMovement = useCallback(() => {
    goToSlide(currentIndex + 1);
  },[currentIndex, goToSlide]);

  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === "ArrowLeft") handleLeftMovement();
      if (event.key === "ArrowRight") handleRightMovement();
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [handleLeftMovement, handleRightMovement]); //

  if (!presentation || !presentation.slides?.[currentIndex]) {
    return <div>Loading slide content...</div>;
  }

  const slideContent = presentation.slides[currentIndex];

  return (
    <PreviewOuter>
      <div className="relative">
        <div className="absolute w-screen z-10 bg-slate-100 transition-all duration-500 opacity-0 hover:opacity-100 top-0">
          <div className="flex w-screen justify-between">
            <X onClick={() => navigate(`/dashboard/${id}/${currentIndex}`)} className="cursor-pointer" />
            <div className="flex gap-8">
              <ArrowLeft
                onClick={handleLeftMovement}
                className="cursor-pointer"
                disabled={currentIndex === 0}
              />
              <ArrowRight
                onClick={handleRightMovement}
                className="cursor-pointer"
                disabled={currentIndex === presentation.slides.length - 1}
              />
            </div>
          </div>
        </div>
        <div style={{
          background:
          slideContent?.details?.type === 'imgurl'
            ? `url("${slideContent?.details?.value}")`
            : slideContent?.details?.type === 'gradient'
              ? `linear-gradient(to bottom left, ${slideContent?.details?.value})`
              : slideContent?.details?.type === 'solid'
                ? slideContent?.details?.value
                : 'gray',  
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }} className="w-screen h-screen bg-slate-500 relative">
          {slideContent.text?.map((textItem) => (
            <PreviewText sIndex={index} pId={id} key={textItem.id} data={textItem} />   
          ))}

          {slideContent.image?.map((imageItem) => (
            <PreviewImage sIndex={index} pId={id} key={imageItem.id} data={imageItem} />
          ))}

          {slideContent.video?.map((videoItem) => (
            <PreviewVideo sIndex={index} pId={id} key={videoItem.id} data={videoItem} />
          ))}

          {slideContent.code?.map((codeItem) => (
            <PreviewCode sIndex={index} pId={id} key={codeItem.id} data={codeItem} />
          ))}
        </div>
      </div>
    </PreviewOuter>
  );
};

export default PreviewPage;

const PreviewOuter = ({ children }) => {
  return (
    <div className="preview-outer">
      {children}
    </div>
  );
};

import { useState, useRef } from "react";
import useStoreHook from "@/hooks/useStoreHook";
import toast from "react-hot-toast";
import EditVideo from "./EditVideo";
import ReactPlayer from 'react-player';

const throttle = (callback, delay) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall < delay) return;
    lastCall = now;
    callback(...args);
  };
};

const DisplayVideo = ({ data, pId, sIndex, parentRef }) => {
  const { handleSlideItemDelete, ElementPositionHandlerContext } = useStoreHook();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isCornersVisible, setIsCornersVisible] = useState(false);
  const [position, setPosition] = useState({ x: data?.position?.x || 0, y: data?.position?.y || 0 });
  const [size, setSize] = useState({
    width: data?.size?.width || 200,
    height: data?.size?.height === "auto" ? "auto" : data?.size?.height || 200
  });

  const elementRef = useRef(null);

  const handleEdit = () => {
    setTimeout(() => {
      setIsPopoverOpen(true);
    }, 500);
  };

  const toggleCorners = () => {
    setIsCornersVisible(!isCornersVisible);
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = position.x;
    const initialY = position.y;
    const parentElement = parentRef.current;

    const onMouseMove = throttle((moveEvent) => {
      let deltaX = ((moveEvent.clientX - startX) / parentElement.clientWidth) * 100;
      let deltaY = ((moveEvent.clientY - startY) / parentElement.clientHeight) * 100;
      let newX = initialX + deltaX;
      let newY = initialY + deltaY;

      newX = Math.max(0, Math.min(newX, 100 - (elementRef.current?.offsetWidth / parentElement.clientWidth) * 100));
      newY = Math.max(0, Math.min(newY, 100 - (elementRef.current?.offsetHeight / parentElement.clientHeight) * 100));
      setPosition({ x: newX, y: newY });
    }, 100); // Throttle the mousemove event

    const onMouseUp = async () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      const { success } = await ElementPositionHandlerContext(pId, data.id, sIndex, size, position, 'video');
      if (success) {
        toast.success('Position changed successfully');
      } else {
        toast.error('Error in updating position');
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleResizeStart = (e, corner) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const initialWidth = size.width;
    const initialHeight = size.height === "auto" ? elementRef.current.offsetHeight : size.height;
    const parentElement = parentRef.current;
    const initialLeft = position.x;
    const initialTop = position.y;

    const onMouseMove = throttle((moveEvent) => {
      moveEvent.preventDefault();
      let deltaX = moveEvent.clientX - startX;
      let deltaY = moveEvent.clientY - startY;
      let newWidth, newHeight, newLeft = position.x, newTop = position.y;

      const pxToPercentageW = (px) => (px / parentElement.clientWidth) * 100;
      const pxToPercentageH = (px) => (px / parentElement.clientHeight) * 100;

      switch (corner) {
      case 'top-left':
        newWidth = Math.max(initialWidth - deltaX, parentElement.clientWidth * 0.01);
        newHeight = Math.max(initialHeight - deltaY, parentElement.clientHeight * 0.01);
        newLeft = initialLeft + pxToPercentageW(deltaX);
        newTop = initialTop + pxToPercentageH(deltaY);
        break;
      case 'top-right':
        newWidth = Math.max(initialWidth + deltaX, parentElement.clientWidth * 0.01);
        newHeight = Math.max(initialHeight - deltaY, parentElement.clientHeight * 0.01);
        newTop = initialTop + pxToPercentageH(deltaY);
        break;
      case 'bottom-left':
        newWidth = Math.max(initialWidth - deltaX, parentElement.clientWidth * 0.01);
        newHeight = Math.max(initialHeight + deltaY, parentElement.clientHeight * 0.01);
        newLeft = initialLeft + pxToPercentageW(deltaX);
        break;
      case 'bottom-right':
        newWidth = Math.max(initialWidth + deltaX, parentElement.clientWidth * 0.01);
        newHeight = Math.max(initialHeight + deltaY, parentElement.clientHeight * 0.01);
        break;
      }

      const maxWidth = parentElement.clientWidth - (position.x / 100 * parentElement.clientWidth);
      const maxHeight = parentElement.clientHeight - (position.y / 100 * parentElement.clientHeight);
      newWidth = Math.min(newWidth, maxWidth);
      newHeight = Math.min(newHeight, maxHeight);

      newLeft = Math.max(0, Math.min(newLeft, 100 - pxToPercentageW(newWidth)));
      newTop = Math.max(0, Math.min(newTop, 100 - pxToPercentageH(newHeight)));

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newLeft, y: newTop });
    }, 100); // Throttle the mousemove event

    const onMouseUp = async () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      const { success } = await ElementPositionHandlerContext(pId, data.id, sIndex, size, position, 'video');
      if (success) {
        toast.success('Size changed successfully');
      } else {
        toast.error('Error in updating size');
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleDeleteElement = async (id) => {
    const type = 'video';
    const { success } = await handleSlideItemDelete(pId, sIndex, id, type);
    if (success) {
      toast.success('Element deleted successfully');
    } else {
      toast.error('Error in deleting element');
    }
  };

  const isYouTubeUrl = (url) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

 

  return (
    <div
      ref={elementRef}
      style={{
        position: "absolute",
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${size.width}px`,
        height: size.height !== "auto" ? `${size.height}px` : "auto",
        zIndex: Number(data?.zIndex) || 1,
      }}
      
   
    >

      <div    style={{ 
        width: `${size.width}px`,
        height: size.height !== "auto" ? `${size.height}px` : "auto",
        zIndex: Number(data?.zIndex) || 1,
      }}    className="border-4 min-w-[120px] cursor-pointer bg-transparent rounded-md border-slate-500"
      onClick={toggleCorners}
      onContextMenu={(e) => {
        e.preventDefault();
        handleDeleteElement(data.id);
      }}
      onDoubleClick={() => handleEdit(data.id)}
      onMouseDown={handleDragStart} >
        {isYouTubeUrl(data?.url) ? (
          <ReactPlayer
            url={`${data?.url}?autoplay=${data?.autoplay ? '1' : '0'}`}
            width="100%"
            height="100%"
            style={{ objectFit: "cover" }} 
            className="react-player"  
          />

        )  : (
          <video
            src={data?.url}
            title={data?.alt || "video"}
            controls
            autoPlay={data?.autoplay}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover", // Set the object-fit property here
            }}
          />

        )}
      </div>
      

      {isCornersVisible && (
        <>
          {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
            <div
              key={pos}
              onMouseDown={(e) => handleResizeStart(e, pos)}
              style={{
                position: "absolute",
                [pos.split("-")[0]]: "-5px",
                [pos.split("-")[1]]: "-5px",
                width: "10px",
                height: "10px",
                cursor: `${pos.split("-")[0]}-${pos.split("-")[1]}-resize`,
                backgroundColor: "red",
              }}
            />
          ))}
        </>
      )}
      <EditVideo
        data={data}
        pId={pId}
        sIndex={sIndex}
        isPopoverOpen={isPopoverOpen}
        setIsPopoverOpen={setIsPopoverOpen}
      />
    </div>
  );
};

export default DisplayVideo;

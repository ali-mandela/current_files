import { useState, useRef } from "react";
import useStoreHook from "@/hooks/useStoreHook";
import toast from "react-hot-toast";
import EditImage from "./EditImage";

const DisplayImage = ({ data, pId, sIndex, parentRef }) => {
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

    const onMouseMove = (moveEvent) => {
      let deltaX = ((moveEvent.clientX - startX) / parentElement.clientWidth) * 100;
      let deltaY = ((moveEvent.clientY - startY) / parentElement.clientHeight) * 100;
      let newX = initialX + deltaX;
      let newY = initialY + deltaY;

      newX = Math.max(0, Math.min(newX, 100 - (elementRef.current?.offsetWidth / parentElement.clientWidth) * 100));
      newY = Math.max(0, Math.min(newY, 100 - (elementRef.current?.offsetHeight / parentElement.clientHeight) * 100));
      setPosition({ x: newX, y: newY });
    };

    const onMouseUp = async () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      console.log('---------------------');
    
      console.log(size);
      const { success } = await ElementPositionHandlerContext(pId, data.id, sIndex,size, position, 'image');
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

    const onMouseMove = (moveEvent) => {
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
    };

    const onMouseUp = async () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleDeleteElement = async (id) => {
    const type = 'image';
    
    
    const { success } = await handleSlideItemDelete(pId, sIndex, id, type);
    if (success) {
      toast.success('Element deleted successfully');
    } else {
      toast.error('Error in deleting element');
    }
  };

  return (
    <div
      ref={elementRef}
      style={{
        position: "absolute",
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${size.width}px`,
        height: size.height != "auto" ? `${size.height}px` : "auto",
        zIndex: Number(data?.zIndex) || 1,
      }}
      
      
    >
      <div onClick={toggleCorners}
        style={{
          width: "100%",
          height: size.height != "auto" ? `${size.height}px` : "auto",
          zIndex: Number(data?.zIndex) || 1,
        }}
        className="border-4 min-w-[120px] cursor-pointer  bg-transparent rounded-md border-slate-500"
        onMouseDown={isCornersVisible ? handleDragStart : null}
        onContextMenu={(e) => {
          e.preventDefault();
          handleDeleteElement(data.id);
        }} 
        onDoubleClick={() => handleEdit(data.id)}>

        <img src={data?.url} alt={data?.altname} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {isCornersVisible && (
        <>
          {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
            <div
              key={pos}
              onMouseDown={(e) => handleResizeStart(e, pos)}
              style={{
                position: "absolute",
                [pos.split("-")[0]]: "-4px",
                [pos.split("-")[1]]: "-4px",
                width: "5px",
                height: "5px",
                backgroundColor: "black",
                cursor: `${pos.split("-").join("")}-resize`,
              }}
            />
          ))}
        </>
      )}

      <EditImage data={data} pId={pId} sIndex={sIndex} isPopoverOpen={isPopoverOpen} setIsPopoverOpen={setIsPopoverOpen} />
    </div>
  );
};

export default DisplayImage;

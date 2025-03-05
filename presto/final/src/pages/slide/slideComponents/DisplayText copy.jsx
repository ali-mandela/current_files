import { useState, useRef } from "react";
import useStoreHook from "@/hooks/useStoreHook";
import toast from "react-hot-toast";
import EditText from "./EditText";

const DisplayText = ({ data, pId, sIndex }) => { 
  const { handleSlideItemDelete, ElementPositionHandlerContext } = useStoreHook();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isCornersVisible, setIsCornersVisible] = useState(false);
  const [position, setPosition] = useState({ x: data?.position?.x || 0, y: data?.position?.y || 0 });

  const elementRef = useRef(null); 

  const handleEdit = () => {
    setTimeout(() => {
      setIsPopoverOpen(true)
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
    const parentElement = elementRef.current?.parentNode;

    const onMouseMove = (moveEvent) => {
      let deltaX = ((moveEvent.clientX - startX) / parentElement.clientWidth) * 100;
      let deltaY = ((moveEvent.clientY - startY) / parentElement.clientHeight) * 100;
      let newX = initialX + deltaX;
      let newY = initialY + deltaY;

      newX = Math.max(0, Math.min(newX, 100 - (elementRef.current?.offsetWidth / parentElement.clientWidth) * 100));
      newY = Math.max(0, Math.min(newY, 100 - (elementRef.current?.offsetHeight / parentElement.clientHeight) * 100)); 
      setPosition({ x: newX, y: newY });
    };

    const onMouseUp = async() => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp); 
      const { success } = await ElementPositionHandlerContext(pId, data.id, sIndex, position, 'text');
      if (success) {
        toast.success('Position changed successfully');
      } else {
        toast.error('Error in updating position');
      } 
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleDeleteElement = async (id) => {
    const type = 'text';
    const { success } = await handleSlideItemDelete(pId, sIndex, id, type);
    if (success) {
      toast.success('Element deleted successfully');
    } else {
      toast.error('Error in deleting element');
    }
  };

  return (
    <div ref={elementRef} style={{ position: "absolute", left: `${position.x}%`, top: `${position.y}%` }}>
      <div
        style={{
          fontSize: `${data?.fsize}em`,
          width: data?.size ? `${data.size}px` : "auto",
          color: data?.color,
          padding: "2px",
          fontFamily: data?.fontFamily || "Arial",
          zIndex: Number(data?.zIndex) || 1,
        }}
        className="border-4 cursor-pointer bg-transparent rounded-md border-slate-500"
        onClick={toggleCorners} 
        onMouseDown={isCornersVisible ? handleDragStart : null}  
        onContextMenu={(e) => {
          e.preventDefault();
          handleDeleteElement(data.id);
        }}
        onDoubleClick={() => handleEdit(data.id)}
      >
        {data?.text}

        {isCornersVisible && (
          <>
            {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
              <div
                key={pos}
                style={{
                  position: "absolute",
                  [pos.split("-")[0]]: "-4px",
                  [pos.split("-")[1]]: "-4px",
                  width: "5px",
                  height: "5px",
                  backgroundColor: "black",
                  cursor: "move",
                }}
              />
            ))}
          </>
        )}

        <EditText data={data} pId={pId} sIndex={sIndex} isPopoverOpen={isPopoverOpen} setIsPopoverOpen={setIsPopoverOpen} />
      </div>
    </div>
  );
};

export default DisplayText;

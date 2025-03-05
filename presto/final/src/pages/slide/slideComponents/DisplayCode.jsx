import { useState, useRef } from "react";
import useStoreHook from "@/hooks/useStoreHook";
import toast from "react-hot-toast";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import EditCode from "./EditCode";

const DisplayCode = ({ data, pId, sIndex, parentRef }) => {
  const { handleSlideItemDelete, ElementPositionHandlerContext } = useStoreHook();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isCornersVisible, setIsCornersVisible] = useState(false);
  const [position, setPosition] = useState({ x: data?.position?.x || 0, y: data?.position?.y || 0 });
  const [size, setSize] = useState({
    width: data?.size?.width || 300, // Increased default width
    height: data?.size?.height === "auto" ? "auto" : data?.size?.height || 200 // Increased default height
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
      const { success } = await ElementPositionHandlerContext(pId, data.id, sIndex, size, position, 'code');
      if (success) {
        toast.success("Position changed successfully");
      } else {
        toast.error("Error in updating position");
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
        newWidth = Math.max(initialWidth - deltaX, 100); // Minimum width of 100px
        newHeight = Math.max(initialHeight - deltaY, 50); // Minimum height of 50px
        newLeft = initialLeft + pxToPercentageW(deltaX);
        newTop = initialTop + pxToPercentageH(deltaY);
        break;
      case 'top-right':
        newWidth = Math.max(initialWidth + deltaX, 100);
        newHeight = Math.max(initialHeight - deltaY, 50);
        newTop = initialTop + pxToPercentageH(deltaY);
        break;
      case 'bottom-left':
        newWidth = Math.max(initialWidth - deltaX, 100);
        newHeight = Math.max(initialHeight + deltaY, 50);
        newLeft = initialLeft + pxToPercentageW(deltaX);
        break;
      case 'bottom-right':
        newWidth = Math.max(initialWidth + deltaX, 100);
        newHeight = Math.max(initialHeight + deltaY, 50);
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
      const { success } = await ElementPositionHandlerContext(pId, data.id, sIndex, size, position, 'code');
      if (success) {
        toast.success("Size changed successfully");
      } else {
        toast.error("Error in updating size");
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleDeleteElement = async (id) => {
    const type = "code";
    const { success } = await handleSlideItemDelete(pId, sIndex, id, type);
    if (success) {
      toast.success("Element deleted successfully");
    } else {
      toast.error("Error in deleting element");
    }
  };

  return (
    <div
      ref={elementRef}
      className="min-w-[120px]"
      style={{
        position: "absolute",
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${size.width}px`,
        height: size.height !== "auto" ? `${size.height}px` : "auto",
        transition: "transform 0.2s ease", // Smooth transition for dragging
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Added shadow for better visibility
      }}
    >
      <div
        style={{ 
          zIndex: Number(data?.zIndex) || 1,
          backgroundColor: "#ffffff",  
          border: "4px solid #ccc",
          borderRadius: "4px",
          cursor: "move",  
          fontSize: `${data?.fsize}em`,
        }}
        className="code-container"
        onClick={toggleCorners}
        onMouseDown={isCornersVisible ? handleDragStart : null}
        onContextMenu={(e) => {
          e.preventDefault();
          handleDeleteElement(data.id);
        }}
        onDoubleClick={handleEdit}
      >
        <SyntaxHighlighter language={data.language} style={tomorrow}>
          {data.code}
        </SyntaxHighlighter>

        {isCornersVisible && (
          <>
            {["top-left", "top-right", "bottom-left", "bottom-right"].map((corner) => (
              <div
                key={corner}
                onMouseDown={(e) => handleResizeStart(e, corner)}
                style={{
                  position: "absolute",
                  [corner.split("-")[0]]: "-6px",
                  [corner.split("-")[1]]: "-6px",
                  width: "10px", // Increased size of resize handles
                  height: "10px",
                  backgroundColor: "red",  
                  cursor: `${corner.split("-").join("")}-resize`,
                  zIndex: 2
                }}
              />
            ))}
          </>
        )}

        <EditCode
          data={data}
          pId={pId}
          sIndex={sIndex}
          isPopoverOpen={isPopoverOpen}
          setIsPopoverOpen={setIsPopoverOpen}
        />
      </div>
    </div>
  );
};

export default DisplayCode;

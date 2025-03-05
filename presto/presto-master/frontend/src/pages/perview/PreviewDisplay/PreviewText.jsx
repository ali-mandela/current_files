/* eslint-disable no-unused-vars */


const PreviewText = ({ data, pId, sIndex }) => {
  return (
    <div 
      style={{
        position: 'absolute', 
        left: `${data?.position?.x || 0}%`,
        top: `${data?.position?.y || 0}%`,
        fontSize: `${data?.fsize}em`,
        color: data?.color,
        padding: '2px',
        fontFamily: data?.fontFamily ? `${data?.fontFamily}` : 'Arial',
        zIndex: Number(data?.zIndex) || 1,
        width: `${data?.size?.width || 0}px`,
        height: `${data?.size?.height || 0}px`,
      }}
      className=" cursor-pointer  "
    >
      {data?.text}
    </div>
  )
}

export default PreviewText
import ReactPlayer from "react-player";

// eslint-disable-next-line no-unused-vars
const PreviewVideo = ({ data, pId, sIndex }) => {
  console.log(data);
  
  const isYouTubeUrl = (url) => {
    console.log('youtube');
    console.log(url);
    if(url.includes("youtube.com") || url.includes("youtu.be")){
      return true;
    }else{
      return false;
    }
  };

  return (
    <div 
      className=" "
      style={{
        position: 'absolute',
        left: `${data?.position?.x || 0}%`,
        top: `${data?.position?.y || 0}%`,
        width: data?.size?.width ? `${data.size?.width}px` : '300px',
        height: data?.size?.height ? `${data.size?.height}px` :'auto',
        zIndex: Number(data?.zIndex) || 1
      }}
    >
      {isYouTubeUrl(data?.url) ? ( 
        <>
          <ReactPlayer url={`${data?.url}?autoplay=${data?.autoplay ? '1' : '0'}`} />
        </>
      ) : (
        <video
          src={data?.url}  
          title={data?.alt || "video"}
          width="100%"
          height="100%"
          controls  
          autoPlay={data?.autoplay}  
          muted  
        >
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default PreviewVideo;

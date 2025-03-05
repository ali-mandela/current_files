/* eslint-disable no-unused-vars */

const PreviewImage = ({ data, pId, sIndex }) => {
  return (
    <div  
      style={{
        position: 'absolute',
        left: `${data?.position?.x || 0}%`,
        top: `${data?.position?.y || 0}%`,
        width: data?.size?.width,
        height: 'auto',
        zIndex: Number(data?.zIndex) || 1
      }}
      className=""

    >
      <img src={data?.url} alt={data?.altname} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}

export default PreviewImage
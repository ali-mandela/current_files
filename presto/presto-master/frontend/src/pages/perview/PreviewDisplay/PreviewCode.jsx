/* eslint-disable no-unused-vars */
import SyntaxHighlighter from "react-syntax-highlighter"
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/hljs"

 
const PreviewCode = ({data,pId,sIndex}) => {
  return (
    <div 
      style={{
        position: 'absolute',
        left: `${data?.position?.x || 0}%`,
        top: `${data?.position?.y || 0}%`,
        fontSize: `${data?.fsize}em`,
        width: data?.size?.width, 
        backgroundColor: '#f5f5f5',
        whiteSpace: 'pre-wrap',
        zIndex: Number(data?.zIndex) || 1
      }}
      className="cursor-pointer"

    >
      <SyntaxHighlighter language={data?.language} style={tomorrow}>
        {data?.code}
      </SyntaxHighlighter> 
    </div>
  )
}

export default PreviewCode
 
 
 

const Page = () => {
  return (
    <div className="w-screen h-screen bg-sky-200">
      <h1>Hello Test</h1>
      <div>

        <iframe
          width="560"
          height="315"
          //   autoplay
          src="https://www.youtube.com/embed/NbQpraQON4Q?si=E0Tf3357oAFBzNDs"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowfullscreen></iframe>
      </div>
    </div>
  )
}

export default Page
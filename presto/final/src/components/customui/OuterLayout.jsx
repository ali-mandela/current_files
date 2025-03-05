import Navbar from './Header'
import Footer from './Footer'

const OuterLayout = ({children}) => {
  return (
    <main className='min-h-screen w-full'>
      <Navbar/> 
      <div className='min-h-[calc(100vh-100px)] px-2 md:px-8 py-2 bg-slate-100'>
        {children}
      </div>
      <Footer/>
    </main>
  )
}

export default OuterLayout
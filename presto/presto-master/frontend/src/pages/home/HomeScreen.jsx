import OuterLayout from '@/components/customui/OuterLayout' 
import banner from '../../assets/banner.svg' 
import TryButton from '@/components/customui/TryButton';

const HomeScreen = () => {
  return (
    <OuterLayout>

      <div className='flex flex-col-reverse gap-8 md:flex-row '>
        <div className='basis-1/2 flex-col flex justify-center'>
          <h1 className='text-3xl text-main font-black md:text-6xl'>Presto</h1>
          <p className='text-md leading-6 font-normal md:text-lg my-4 '>lightweight app that is a lot more enjoyable and interesting to use and that
                        will revolutionise the presentations industry for decades to come.</p>
          <TryButton/>
        </div>
        <div className='basis-1/2'>
          <img src={banner} alt='banner image' className='object-cover w-full '/>

        </div>
      </div>
    </OuterLayout>
  )
}

export default HomeScreen
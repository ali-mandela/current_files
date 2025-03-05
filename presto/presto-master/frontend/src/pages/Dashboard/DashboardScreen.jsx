import CreatePreComponent from '@/components/customui/CreatePreComponent';
import DisplayPresentations from '@/components/customui/DisplayPresentations';
import OuterLayout from '@/components/customui/OuterLayout'; 
import { Suspense, } from 'react';

const DashboardScreen = () => { 
  

  return (
    <OuterLayout>
      <div className='flex my-4 justify-end'>
        <CreatePreComponent />
      </div>
      <Suspense fallback={<p>Loading...</p>}>
        <DisplayPresentations />
      </Suspense>
    </OuterLayout>
  );
};

export default DashboardScreen;

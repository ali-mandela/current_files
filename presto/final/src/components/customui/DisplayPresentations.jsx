import useStoreHook from '@/hooks/useStoreHook';
import { useEffect, useState } from 'react';
import PresentationComponent from './PresentationComponent';
import { fetchStoreData } from '@/helper/fetchApi';

const DisplayPresentations = () => {
  const { globalStorage, setGlobalStorage } = useStoreHook();
  const [presentations, setPresentations] = useState(globalStorage?.presentations || []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchStoreData(setGlobalStorage);
      if (globalStorage?.presentations) {
        setPresentations(globalStorage.presentations);
      }
    };

    if (!globalStorage?.presentations) {
      fetchData();
    }
  }, [setGlobalStorage, globalStorage?.presentations]);

  useEffect(() => {
    setPresentations(globalStorage?.presentations || []);
  }, [globalStorage]);

  return (
    <>
      {(presentations?.length === 0 || !presentations) && (
        <p className="text-slate-600">No Presentation to display. Please create one.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 my-4 md:gap-4">
        {presentations?.map((item) => (
          <PresentationComponent item={item} key={item.id} />
        ))}
      </div>
    </>
  );
};

export default DisplayPresentations;

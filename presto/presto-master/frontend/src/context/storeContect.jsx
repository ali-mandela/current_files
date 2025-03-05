/* eslint-disable no-unused-vars */
import axios from "axios";
import { createContext, useState,  } from "react";  

const StoreContext = createContext();

const StoreProvider = ({ children }) => {
  const [globalStorage, setGlobalStorage] = useState({
    presentations:[]
  }); 
  
  const syncStoreDataLogout = async () => {  
    // const updatedStore = deepCloneWithoutCircularRefs(globalStorage);  
    const updatedStore = {...globalStorage} 
    const token = JSON.parse(localStorage.getItem('token'));  
    
  
    try {
      const res = await axios.put('/store', { store: updatedStore }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.status === 200) {
        setGlobalStorage(res.data.store); 
        console.log('added to db');
        return { success: true };
      }
    } catch (error) {
      console.error("Failed to sync store data:", error);
      return { success: false };
    }
  };
  

  const syncStoreData = async () => { 
    // const token = JSON.parse(localStorage.getItem('token'));

    // try {
    //   const res = await axios.put('/store',   {store : updatedStore}  , {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }); 
      
    //   if (res.status === 200) {
    //     setGlobalStorage(res.data.store);
    //     console.log("Store synced successfully");
    //     return {success: true}
    //   }
    // } catch (error) {
    //   console.error("Failed to sync store data:", error);
    //   return {success: false}
    // }
    

    return {success:true}
  };
 
  const addPresentation = async (presentationData) => {  
    let { slides, id } = presentationData; 
    slides = slides || []; 
    slides.push({
      details: {
        type: "",
        value: '',
      }, 
      version: [
      ],
    });
    
    const newPresentationData = {
      ...presentationData,
      slides,
      id
    };    
    const updatedStore = { ...globalStorage };
    updatedStore.presentations = updatedStore.presentations || [];
    updatedStore.presentations.push(newPresentationData);
   
    setGlobalStorage(updatedStore);
    const { success } = await syncStoreData(updatedStore);
    return { success };
  };
  // function to delete presentation
  const deletePresentation = async (id) => {  
    const updatedStore = { ...globalStorage }; 
    let allPresentations = updatedStore?.presentations;

    const presentationNotToDelete = allPresentations.filter((p)=> p.id !== id); 
    updatedStore.presentations = presentationNotToDelete;  
    setGlobalStorage(updatedStore);
    const { success } = await syncStoreData(updatedStore);
    return { success };
  };
  // function to edit presentation details
  const EditPresentation = async ({ data, id, type = 'text' }) => {
    const { name, description, thumbnail } = data;  
    const updatedStore = { ...globalStorage };
    let allPresentations = updatedStore?.presentations || [];
   
    const presentationToEdit = allPresentations.find((p) => p.id == id); 
  
    if (!presentationToEdit) {
      return {success:false}
    }
   
    const updatedPresentation = { ...presentationToEdit };
  
    if (type === 'text') {
      if (name !== undefined) {
        updatedPresentation.name = name; 
      }
      if (description !== undefined) {
        updatedPresentation.description = description;  
      }
    
      if (thumbnail !== undefined) {
        updatedPresentation.thumbnail = thumbnail;  
      }  
    } 
    updatedStore.presentations = allPresentations.map((p) => 
      p.id === id ? updatedPresentation : p
    );
  
    setGlobalStorage(updatedStore);
   
    const { success } = await syncStoreData(updatedStore);
    return { success };
  };
  
  

  const addSlideToPresentation = (id) => {
    const updatedStore = { ...globalStorage };
    const presentation = updatedStore.presentations?.find(p => p.id === id);

    if (presentation) {
      presentation.slides = presentation.slides || [];
      presentation.slides.push({
        details: {
          type: "",
          value: '',
        }, 
        version: [
        ],
      });

      setGlobalStorage(updatedStore);
      syncStoreData(updatedStore);  
      return { success: true };

    } else {
      console.error("Presentation not found");
      return { success: false };

    }
  };
  const addDataToSlide = (id, index, data, type = 'text') => {
    const updatedStore = { ...globalStorage };
    const presentation = updatedStore.presentations?.find(p => p.id === id);
  
    if (presentation && presentation.slides[index]) {
      const slide = presentation.slides[index];
  
      slide[type] = slide[type] || [];
      slide[type].push(data);
  
      setGlobalStorage(updatedStore);
      syncStoreData(updatedStore);
  
      return { success: true };
    } else {
      console.error("Presentation or slide not found");
      return { success: false };
    }
  };
  
  const DeleteSlideToPresentation = (id,selectedIndex) => {
    const updatedStore = { ...globalStorage };   
     
    const presentation = updatedStore.presentations?.find(p => p.id == id);
  
    if (presentation && presentation.slides && selectedIndex >= 0 && selectedIndex < presentation.slides.length) {
      presentation.slides.splice(selectedIndex, 1);
  
      updatedStore.presentations = updatedStore.presentations.map(p => 
        p.id === id ? presentation : p
      );
  
      setGlobalStorage(updatedStore);
      syncStoreData(updatedStore);
      
      
  
      return { success: true };
    } 
  
    return { success: false};
  };
  

  const editSlideInPresentation = (presentationId, slideId, updatedSlideData) => {
    const updatedStore = { ...globalStorage };
    const presentation = updatedStore?.presentation?.find(p => p.id === presentationId);

    if (presentation) {
      const slideIndex = presentation.slides?.findIndex(s => s.id === slideId);
      if (slideIndex !== -1) {
        presentation.slides[slideIndex] = { ...presentation.slides[slideIndex], ...updatedSlideData };

        setGlobalStorage(updatedStore);
        syncStoreData(updatedStore); // Sync with server
      } else {
        console.error("Slide not found");
      }
    } else {
      console.error("Presentation not found");
    }
  };

  // SLIDE ITEMS

  const handleSlideItemDelete = async (pId, sIndex, itemId, type = 'text') => {
    const updatedStore = { ...globalStorage };
    const presentation = updatedStore.presentations?.find(p => p.id === pId);
  
    if (presentation && presentation.slides[sIndex]) {
      const slide = presentation.slides[sIndex]; 
      if (slide[type]) {
        slide[type] = slide[type].filter(item => item.id !== itemId);
  
        setGlobalStorage(updatedStore);
        await syncStoreData(updatedStore);  
  
        return { success: true };
      } else {
        console.error(`Type "${type}" not found in slide`);
        return { success: false };
      }
    } else {
      console.error("Presentation or slide not found");
      return { success: false };
    }
  };

  const handleSlideItemEdit = async (pId, sIndex, itemId, type = 'text', data) => {
    const updatedStore = { ...globalStorage };
    const presentation = updatedStore.presentations?.find(p => p.id === pId);
    if (presentation && presentation.slides[sIndex]) {
      const slide = presentation.slides[sIndex]; 
        
      if (slide[type]) {
        // Find the index of the item to edit
        const itemIndex = slide[type].findIndex(item => item.id === itemId);
            
        if (itemIndex !== -1) {
          // Replace the content of the found item with the new data
          slide[type][itemIndex] = {
            ...slide[type][itemIndex], // preserve other properties
            ...data // overwrite with new values
          };
                
          setGlobalStorage(updatedStore);
          await syncStoreData(updatedStore);  
                
          return { success: true };
        } else {
          console.error(`Item with id "${itemId}" not found in slide`);
          return { success: false };
        }
      } else {
        console.error(`Type "${type}" not found in slide`);
        return { success: false };
      }
    } else {
      console.error("Presentation or slide not found");
      return { success: false };
    }
  };

  const addSlideTheme = (id, index, details) => {
    const updatedStore = { ...globalStorage };
    const presentation = updatedStore.presentations?.find(p => p.id === id);
  
    if (presentation) {
     
      if (index >= 0 && index < presentation.slides.length) {
        presentation.slides[index] = {
          details:details
        };
      } else {
        console.error("Invalid slide index:", index);
        return { success: false };

      }
  
      // Update global storage and synchronize
      setGlobalStorage(updatedStore);
      syncStoreData(updatedStore);
      return { success: true };

    } else {
      console.error("slide not found");
      return { success: false };

    }
  };

  const SLideRearrangeHandlerContext = (id, data) => { 
    const updatedStore = { ...globalStorage };
    const presentation = updatedStore.presentations?.find(p => p.id === id);  
    if (presentation) {
      presentation.slides = data;  
      setGlobalStorage(updatedStore);
      syncStoreData(updatedStore);
      return { success: true };

    } else {
      console.error("slide not found");
      return { success: false };

    }
  };
  const ElementPositionHandlerContext = (pId, Eid, sIndex,size, position, type) => {
   
    const updatedStore = { ...globalStorage };
   
    const presentation = updatedStore.presentations?.find(p => p.id === pId);
  
    if (!presentation) {
      console.error("Presentation not found for pId:", pId);
      return { success: false };
    }
   
    const slide = presentation.slides[sIndex];
  
    if (!slide) {
      console.error("Slide not found at index:", sIndex);
      return { success: false };
    } 
    const element = slide[type]?.find(el => el.id === Eid);
  
    if (!element) {
      console.error(`Element not found of type ${type} with id:`, Eid);
      return { success: false };
    }
   
    element.position = position;
    element.size=size;
   
    setGlobalStorage(updatedStore);
    syncStoreData(updatedStore);
  
    console.log("Position updated successfully for element:", { pId, Eid, sIndex, position, element });
    return { success: true };
  };

  const UpdateVersionContext = (pId, sIndex, slideData) => {
    console.log('uploaded ,',slideData); 
    const {version, details, ...rest} = slideData;
     
    const updatedStore = { ...globalStorage };
    const presentation = updatedStore.presentations?.find((p) => p.id === pId);
  
    if (!presentation) {
      console.error("Presentation not found for pId:", pId);
      return { success: false };
    }
  
    const slide = presentation.slides[sIndex];
    if (!slide) {
      console.error("Slide not found at index:", sIndex);
      return { success: false };
    }
    let slideVersion = slide?.version || [];
    slideVersion?.unshift(rest);
   
    if (slideVersion?.length > 10) {
      slide.version.pop();
    } 
    
    setGlobalStorage(updatedStore);
    syncStoreData(updatedStore);
  
    return { success: true };
  };

  const UpdateVersionIndexItem = (pId, index, data) => { 
    console.log(pId, index, data);

   
    
    const updatedStore = { ...globalStorage };
    const presentation = updatedStore.presentations?.find((p) => p.id === pId);
  
    if (!presentation) {
      console.error("Presentation not found for pId:", pId);
      return { success: false };
    }
  
    const slide = presentation.slides[index];
    if (!slide) {
      console.error("Slide not found at index:", index);
      return { success: false };
    }
   
    const { details, version, ...rest } = slide;
 
    presentation.slides[index] = {
      details,
      ...data,  
      version  
    };
   
    setGlobalStorage(updatedStore);
    syncStoreData(updatedStore);
 
    return { success: true };
  
  };
  
   
  return (
    <StoreContext.Provider value={{ globalStorage, setGlobalStorage,UpdateVersionIndexItem,ElementPositionHandlerContext,UpdateVersionContext,SLideRearrangeHandlerContext,syncStoreDataLogout, addDataToSlide,addSlideTheme, handleSlideItemEdit,handleSlideItemDelete, addPresentation,deletePresentation,DeleteSlideToPresentation, EditPresentation, addSlideToPresentation, editSlideInPresentation }}>
      {children}
    </StoreContext.Provider>
  );
};





export default StoreContext;
export { StoreProvider,};

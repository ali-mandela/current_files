 
import StoreContext from "@/context/storeContect";
import { useContext } from "react";

const useStoreHook = () => {
  return useContext(StoreContext);
}
  
export default useStoreHook
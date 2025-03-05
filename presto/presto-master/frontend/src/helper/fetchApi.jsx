import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchStoreData = async (setGlobalStorage) => {
  let token;
  try {
    token = JSON.parse(localStorage.getItem('token'));
  } catch (error) {
    console.error("Error parsing token:", error);
    toast.error("Unable to retrieve login token. Please log in again.");
    return;
  }
  
  if (!token) {
    toast.error("Token not found. Please log in again.");
    return;
  }
  
  try {
    const res = await axios.get('/store', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 200) {
      const storeData = res?.data?.store;
      setGlobalStorage(storeData);
    }
  } catch (error) {
    console.error("Failed to fetch store data:", error);
    toast.error("Failed to load store data. Please try again later.");
  }
};

import OuterLayout from "@/components/customui/OuterLayout";
import axios from "axios";
import { useState, useEffect } from "react";

const MediaUploadInput = ({ label, mediaCategory, onFileSelect }) => (
  <div>
    <h2>Upload {label}</h2>
    <input
      type="file"
      accept={mediaCategory === "image" ? "image/*" : "video/*"}
      onChange={(e) => onFileSelect(e, mediaCategory)}
    />
  </div>
);

const UploadButton = ({ onClick }) => (
  <button className="bg-slate-900 px-4 py-2 my-4 text-white rounded-lg" onClick={onClick}>
    Upload All
  </button>
);

const MediaDisplay = ({ storeData }) => (
  <div>
    <h3>Images</h3>
    <div className="media-grid b-2 rounded">
      {storeData?.images?.map((image) => (
        <div key={image.id} className="media-item">
          <img src={`data:${image.type};base64,${image.content}`} alt={image.name} />
        </div>
      ))}
    </div>

    {/* <h3>Videos</h3>
    <div className="media-grid">
      {storeData?.videos?.map((video) => (
        <div key={video.id} className="media-item">
          <video controls>
            <source src={`data:${video.type};base64,${video.content}`} type={video.type} />
            Your browser does not support the video tag.
          </video>
        </div>
      ))}
    </div> */}
  </div>
);

// Main Component
const TestBlock = () => {
  const [storeData, setStoreData] = useState({ images: [], videos: [] });
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Fetch data from the server
  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      const res = await axios.get("/store", {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      setStoreData(res.data.store || { images: [], videos: [] });
    } catch (error) {
      console.error("Error fetching store data:", error);
    }
  };

  // Handle file selection
  const handleFileSelect = (event, mediaCategory) => {
    const file = event.target.files[0];
    if (mediaCategory === "image") {
      setSelectedImage(file);
    } else if (mediaCategory === "video") {
      setSelectedVideo(file);
    }
  };

  // Save media to the server
  const saveMediaToServer = async (base64Media, mediaType, mediaCategory) => {
    try {
      const res = await axios.get("/store", {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      const storeData = res.data.store || { images: [], videos: [] };

      const newMediaEntry = {
        id: Date.now(),
        type: mediaType,
        content: base64Media,
        name: mediaType.includes("image") ? "MyImageFile" : "MyVideoFile",
      };

      if (mediaCategory === "image") {
        storeData.images.push(newMediaEntry);
      } else if (mediaCategory === "video") {
        storeData.videos.push(newMediaEntry);
      }

      const putResponse = await axios.put("/store", storeData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });

      if (putResponse.status === 200) {
        setStoreData(storeData);
      } else {
        console.error("Error saving media:", putResponse.statusText);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // Handle upload for both image and video
  const handleUpload = () => {
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        saveMediaToServer(base64String, selectedImage.type, "image");
      };
      reader.readAsDataURL(selectedImage);
    }

    if (selectedVideo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        saveMediaToServer(base64String, selectedVideo.type, "video");
      };
      reader.readAsDataURL(selectedVideo);
    }
  };

  return (
    <OuterLayout>
      {/* Image and Video Upload Inputs */}
      <MediaUploadInput label="Image" mediaCategory="image" onFileSelect={handleFileSelect} />

      {/* Upload Button for both media types */}
      <UploadButton onClick={handleUpload} />

      {/* Display Media */}
      <MediaDisplay storeData={storeData} />
    </OuterLayout>
  );
};

export default TestBlock;

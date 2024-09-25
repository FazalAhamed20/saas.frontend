import axios from 'axios'

const cloudinaryApi=import.meta.env.VITE_CLOUDINARY_API as string;

export const uploadImageToCloudinary = async (file: File) => {
    const imageData = new FormData();
    imageData.append('file', file);
    imageData.append('upload_preset', 'upload');

    const response = await axios.post(
      `${cloudinaryApi}`,
      imageData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data.url

  }
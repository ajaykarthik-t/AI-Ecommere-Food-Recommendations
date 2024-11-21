import { firebaseApp } from "@/firebaseConfig";
import { uploadBytes, getDownloadURL, ref, getStorage } from "firebase/storage";

export const uploadImagesAndReturnUrls = async (files: any) => {
  try {
    // upload files and get image references
    const imageRefs = await Promise.all(
      files.map((file: any) => {
        const storage = getStorage(firebaseApp);
        const storageRef = ref(storage, `products/${file.name}`);
        return uploadBytes(storageRef, file);
      })
    );

    // use image references to get download urls
    const imageUrls = await Promise.all(
      imageRefs.map((imageRef: any) => getDownloadURL(imageRef.ref))
    );

    return imageUrls;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

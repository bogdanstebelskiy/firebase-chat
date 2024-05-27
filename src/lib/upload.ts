import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";

const upload = async (file: File) => {
  const date = new Date();

  const storageRef = ref(storage, `images/${date + file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((res, rej) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error: Error) => {
        rej("Something went wrong! " + error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          res(downloadURL);
        });
      }
    );
  });
};

export default upload

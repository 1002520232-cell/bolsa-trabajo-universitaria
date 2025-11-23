import { Injectable, inject } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage = getStorage();

  /**
   * Uploads a file to Firebase Storage under the specified path.
   * @param file The file to upload.
   * @param path The path inside the storage bucket.
   * @returns Promise that resolves with the download URL of the uploaded file.
   */
  async uploadFile(file: File, path: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, path);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file to Firebase Storage:', error);
      throw error;
    }
  }
}

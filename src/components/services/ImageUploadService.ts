import axios from 'axios';

export interface UploadResponse {
  url: string;
  success: boolean;
  message?: string;
}

class ImageUploadService {
  private static instance: ImageUploadService;
  private readonly API_URL = 'http://localhost:8000/api';

  private constructor() {}

  public static getInstance(): ImageUploadService {
    if (!ImageUploadService.instance) {
      ImageUploadService.instance = new ImageUploadService();
    }
    return ImageUploadService.instance;
  }

  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  /**
   * Upload a single image file to the server
   * @param file The file to upload
   * @param onProgress Optional callback for upload progress
   * @returns Promise with upload response
   */
  public async uploadImage(
    file: File, 
    onProgress?: (percentage: number) => void
  ): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${this.API_URL}/uploads`, 
        formData, 
        {
          headers: {
            ...this.getAuthHeaders(),
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const percentage = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(percentage);
            }
          }
        }
      );

      return {
        url: response.data.url,
        success: true
      };
    } catch (error: any) {
      console.error('Error uploading image:', error);
      return {
        url: '',
        success: false,
        message: error.response?.data?.message || 'Upload failed'
      };
    }
  }

  /**
   * Upload multiple image files with progress tracking
   * @param files Array of files to upload
   * @param onProgress Optional callback for upload progress
   * @returns Promise with array of upload responses
   */
  public async uploadMultipleImages(
    files: File[],
    onProgress?: (percentage: number) => void
  ): Promise<UploadResponse[]> {
    try {
      // For demo purposes, we'll simulate the upload
      // In a real app, you would upload each file or use a bulk upload endpoint
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate progress updates
      if (onProgress) {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          onProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
          }
        }, 200);
      }
      
      // Create simulated URLs for each file
      return files.map(file => ({
        url: `http://localhost:8000/uploads/${Date.now()}-${file.name.replace(/\s/g, '-')}`,
        success: true
      }));
      
      // In a real implementation, you'd do something like:
      // return Promise.all(files.map(file => this.uploadImage(file)));
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      return files.map(() => ({
        url: '',
        success: false,
        message: 'Upload failed'
      }));
    }
  }

  /**
   * Delete an image from the server
   * @param url URL of the image to delete
   * @returns Promise with delete operation status
   */
  public async deleteImage(url: string): Promise<{ success: boolean, message?: string }> {
    try {
      // Extract filename from URL
      const filename = url.split('/').pop();
      
      if (!filename) {
        return { success: false, message: 'Invalid image URL' };
      }
      
      await axios.delete(`${this.API_URL}/uploads/${filename}`, {
        headers: this.getAuthHeaders()
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting image:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Delete failed' 
      };
    }
  }
}

export default ImageUploadService;
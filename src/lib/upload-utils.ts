import { UploadedImage, ImageMetadata } from '@/types/upload';
import { LocationData } from '@/types/location';

export class UploadService {
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  validateFile(file: File): { valid: boolean; error?: string } {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: 'File type not supported. Please upload JPEG, PNG, WebP, or GIF images.' };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: 'File size too large. Please upload images smaller than 10MB.' };
    }

    return { valid: true };
  }

  async uploadImage(
    file: File, 
    location?: LocationData,
    onProgress?: (progress: number) => void
  ): Promise<UploadedImage> {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const formData = new FormData();
    formData.append('file', file);
    
    if (location) {
      formData.append('location', JSON.stringify(location));
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Invalid response from server'));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed due to network error'));
      });

      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    });
  }

  async getImageMetadata(file: File): Promise<ImageMetadata> {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        const metadata: ImageMetadata = {
          width: img.naturalWidth,
          height: img.naturalHeight
        };
        URL.revokeObjectURL(url);
        resolve(metadata);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({});
      };

      img.src = url;
    });
  }

  createImagePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async fetchUploadedImages(): Promise<UploadedImage[]> {
    try {
      const response = await fetch('/api/images');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch uploaded images:', error);
      return [];
    }
  }
}

export const uploadService = new UploadService();
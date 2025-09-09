import { LocationData } from './location';

export interface UploadedImage {
  id: string;
  filename: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: number;
  location?: LocationData;
  metadata?: ImageMetadata;
}

export interface ImageMetadata {
  width?: number;
  height?: number;
  exifData?: Record<string, any>;
  description?: string;
}

export interface UploadProgress {
  filename: string;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  error?: string;
}

export interface UploadState {
  files: File[];
  uploads: UploadProgress[];
  isUploading: boolean;
  completedUploads: UploadedImage[];
}

export interface DragState {
  isDragOver: boolean;
  isDragActive: boolean;
}
"use client";

import { useState } from "react";
import { uploadJson, uploadDirectory } from "../utils/storacha/upload";

export function useStorachaUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadProfile(profile: any) {
    return handleUpload(() => uploadJson(profile));
  }

  async function uploadTask(task: any) {
    return handleUpload(() => uploadJson(task));
  }

  async function uploadFiles(files: File[]) {
    return handleUpload(() => uploadDirectory(files));
  }

  async function handleUpload<T>(fn: () => Promise<T>) {
    try {
      setUploading(true);
      setError(null);
      return await fn();
    } catch (e: any) {
      setError(e?.message ?? "Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  }

  return { uploadProfile, uploadTask, uploadFiles, uploading, error };
}

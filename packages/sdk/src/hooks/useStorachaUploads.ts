// "use client";

// import { uploadJsonToPinata } from "@verse/storage";
// import { useState } from "react";

// export function useStorachaUpload() {
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   async function uploadProfile(profile: any) {
//     return handleUpload(() => uploadJsonToPinata(profile));
//   }

//   async function uploadTask(task: any) {
//     return handleUpload(() => uploadJsonToPinata(task));
//   }

//   // async function uploadFiles(files: File[]) {
//   //   return handleUpload(() => uploadDirectory(files));
//   // }

//   async function handleUpload<T>(fn: () => Promise<T>) {
//     try {
//       setUploading(true);
//       setError(null);
//       return await fn();
//     } catch (e: any) {
//       setError(e?.message ?? "Upload failed");
//       return null;
//     } finally {
//       setUploading(false);
//     }
//   }

//   return { uploadProfile, uploadTask, uploading, error };
// }

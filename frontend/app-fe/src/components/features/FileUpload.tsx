import { type FC } from "react";
import { toast } from "sonner";
import { UppyContextProvider } from "@uppy/react";
import { Uppy } from "@uppy/core";
import CloudStorage from "@uppy/aws-s3";
import FileDragDrop from "@/components/features/components/FileDragDrop";
import FilesList from "@/components/features/components/FilesList";
import Upload from "@/components/features/components/Upload";

const uppy = new Uppy({
  autoProceed: false,
  restrictions: {
    maxNumberOfFiles: 8, // Maximum number of files selectable at once
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedFileTypes: [
      "application/pdf",
      "text/plain",
      "text/markdown",
      "text/html",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
  onBeforeFileAdded: (file, files) => {
    const MAX_FILES = 8;
    const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB
    const ALLOWD_FILE_TYPES = [
      "application/pdf",
      "text/markdown",
      "text/plain",
      "text/markdown",
      "text/html",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const existingFiles = Object.values(files);

    const totalFileCount = existingFiles.length + 1;

    // Check total number of files being uploaded
    if (totalFileCount > MAX_FILES) {
      toast.error("You can only upload up to 8 files at a time.", {
        position: "top-right",
        style: { backgroundColor: "red", color: "white" },
      });
      return false; // Prevent the upload
    }

    const existingFilesSize = existingFiles.reduce(
      (total, existingFile) => total + (existingFile.size ?? 0),
      0,
    );

    const totalSize = existingFilesSize + (file.size ?? 0);

    // Check total file size of all files being uploaded
    if (totalSize > MAX_TOTAL_SIZE) {
      toast.error("Total file size exceeds the 100MB limit.", {
        position: "top-right",
        style: { backgroundColor: "red", color: "white" },
      });
      return false; // Prevent the upload
    }

    // Check if the file type is allowed
    if (file.type && !ALLOWD_FILE_TYPES.includes(file.type)) {
      toast.error(`File type not allowed: ${file.type}`, {
        position: "top-right",
        style: { backgroundColor: "red", color: "white" },
      });
      return false; // Prevent the upload
    }

    return true; // Allow the upload
  },
}).use(CloudStorage, {
  shouldUseMultipart: false,
  async getUploadParameters(file) {
    try {
      const baseUrL = import.meta.env.VITE_API_BASE_URL;

      const params = new URLSearchParams({
        file_name: file.name,
      });

      const response = await fetch(
        `${baseUrL}/upload-signed-url?${params.toString()}`,
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch signed URL: ${response.status}`);
      }
      const data = await response.json();

      return {
        method: "PUT",
        url: data.signed_url,
        headers: {
          "Content-Type": "application/octet-stream",
        },
      };
    } catch (error) {
      toast.error(`${error instanceof Error ? error.message : String(error)}`, {
        position: "top-right",
        style: { backgroundColor: "red", color: "white" },
      });
      throw Promise.reject(
        new Error(`${error instanceof Error ? error.message : String(error)}`),
      );
    }
  },
});

const FileUpload: FC = () => {
  return (
    <UppyContextProvider uppy={uppy}>
      <Upload />
      <div className="mt-10 px-4 gap-16 flex justify-between items-start">
        <section className="basis-1/3">
          <FileDragDrop />
        </section>
        <section className="basis-2/3">
          <FilesList />
        </section>
      </div>
    </UppyContextProvider>
  );
};
export default FileUpload;

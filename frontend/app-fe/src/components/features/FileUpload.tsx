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
    console.log("Attempting to add file:", file);
    const ALLOWD_FILE_TYPES = [
      "application/pdf",
      "text/markdown",
      "text/plain",
      "text/markdown",
      "text/html",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const filesToUpload = Object.values(files);

    // Check total number of files being uploaded
    if (files && Object.values(files).length > 8) {
      toast.error("You can only upload up to 8 files at a time.", {
        position: "top-right",
        style: { backgroundColor: "red", color: "white" },
      });
      return false; // Prevent the upload
    }

    // Check total file size of all files being uploaded
    if (filesToUpload && filesToUpload.length > 0) {
      const fileSize = filesToUpload.reduce((acc, file) => acc + file?.size, 0);
      if (fileSize > 100 * 1024 * 1024) {
        toast.error("Total file size exceeds the 100MB limit.", {
          position: "top-right",
          style: { backgroundColor: "red", color: "white" },
        });
        return false; // Prevent the upload
      }
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
      const response = await fetch(
        `http://127.0.0.1:8000/api/upload-signed-url/${file.name}`,
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

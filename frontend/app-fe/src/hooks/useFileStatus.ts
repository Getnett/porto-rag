import { useContext, useState } from "react";
import { toast } from "sonner";
import { UppyContext, useUppyEvent } from "@uppy/react";
import { type Meta, type Uppy } from "@uppy/core";

type FileStatus = "uploading" | "uploaded" | "failed" | "waiting";

export default function useFileStatus() {
  const uppyContext = useContext(UppyContext);
  const [fileStatuses, setFileStatuses] = useState<Record<string, FileStatus>>(
    {},
  );

  // Event hooks
  useUppyEvent(
    uppyContext.uppy as Uppy<Meta, Record<string, never>>,
    "upload-error",
    (file, error) => {
      console.log("Error details:", error);
      const source = error?.source as XMLHttpRequest | undefined;
      if (source) {
        toast.error(`Upload failed : ${source.status}`, {
          position: "top-right",
          style: { backgroundColor: "red", color: "white" },
        });
      }

      setFileStatuses((prevStatuses) => ({
        ...prevStatuses,
        [file?.id ?? ""]: "failed",
      }));
    },
  );

  useUppyEvent(
    uppyContext.uppy as Uppy<Meta, Record<string, never>>,
    "upload-success",
    (file) => {
      toast.success(`Upload successful for file: ${file?.name}`, {
        position: "top-right",
        style: { backgroundColor: "green", color: "white" },
      });
      setFileStatuses((prevStatuses) => ({
        ...prevStatuses,
        [file?.id ?? ""]: "uploaded",
      }));
    },
  );

  useUppyEvent(
    uppyContext.uppy as Uppy<Meta, Record<string, never>>,
    "upload",
    (_, files) => {
      files.forEach((file) => {
        setFileStatuses((prevStatuses) => ({
          ...prevStatuses,
          [file?.id ?? ""]: "uploading",
        }));
      });
    },
  );

  // TODO review this event, wheather its best way to remove the file after upload or not, maybe we can just set the status to uploaded and let the user remove it when they want
  useUppyEvent(
    uppyContext.uppy as Uppy<Meta, Record<string, never>>,
    "complete",
    (result) => {
      setTimeout(() => {
        result.successful?.forEach((file) => {
          uppyContext?.uppy?.removeFile(file.id);
        });
      }, 5000);
    },
  );

  return fileStatuses;
}

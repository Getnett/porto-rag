import { useContext, type FC } from "react";
import { toast } from "sonner";
import { useUppyState, UppyContext } from "@uppy/react";
import { Button } from "@/components/ui/button";
import type { Meta, Uppy } from "@uppy/core";

const Upload: FC = () => {
  const uppyContext = useContext(UppyContext);
  const files = useUppyState(
    uppyContext.uppy as Uppy<Meta, Record<string, never>>,
    (state) => state.files,
  );

  const hasFiles = Object.values(files).length > 0;

  const handleUpload = async () => {
    if (!hasFiles) return;
    if (!uppyContext.uppy) return;
    try {
      await uppyContext.uppy.upload();
    } catch (error) {
      toast.error(`Upload failed BUTTON: ${error}`, {
        position: "top-right",
        style: { backgroundColor: "red", color: "white" },
      });
    }
  };

  return (
    <section className="w-full flex items-center justify-end px-4">
      <Button
        disabled={
          !hasFiles ||
          Object.values(files).some((file) => file.progress.uploadStarted)
        }
        className="rounded-sm enabled:cursor-pointer disabled:pointer-events-auto disabled:cursor-not-allowed"
        onClick={handleUpload}
      >
        Upload Documents
      </Button>
    </section>
  );
};

export default Upload;

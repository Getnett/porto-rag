import { type FC } from "react";
import { useDropzone } from "@uppy/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppIcon } from "@/components/icons/AppIcon";

const FileDragDrop: FC = () => {
  const { getRootProps, getInputProps } = useDropzone();

  return (
    <Card className="w-full max-w-sm rounded-sm gap-0">
      <CardHeader>
        <CardTitle>Upload Documents</CardTitle>
      </CardHeader>
      <CardContent className="py-4 ">
        <div
          {...getRootProps()}
          className="border border-dashed rounded-sm  p-4 text-center cursor-pointer"
        >
          <input {...getInputProps()} className="hidden" />
          <div className="flex items-center justify-center mb-4">
            <AppIcon name="upload" className="size-10" />
          </div>
          <p>
            Drag & drop files here <br /> or <button>browse</button>
          </p>
          <CardFooter className="flex-col gap-2 border-t-0">
            .PDF, .DOCX, .TXT, .MD <br />
            Max file size: 100MB
          </CardFooter>
        </div>
      </CardContent>
    </Card>
  );
};
export default FileDragDrop;

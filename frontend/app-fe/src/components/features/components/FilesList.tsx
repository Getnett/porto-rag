import { type FC, useContext } from "react";
import { type Meta, type Uppy } from "@uppy/core";
import { useUppyState, UppyContext, Thumbnail } from "@uppy/react";
import { Progress } from "@/components/ui/progress";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icons/AppIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatFileSize } from "@/lib/utils";
import useFileStatus from "@/hooks/useFileStatus";
import "@uppy/react/css/style.css";

const FilesList: FC = () => {
  const uppyContext = useContext(UppyContext);
  const files = useUppyState(
    uppyContext.uppy as Uppy<Meta, Record<string, never>>,
    (state) => state.files,
  );
  const fileList = Object.values(files);
  const fileStatuses = useFileStatus();

  return (
    <>
      {fileList.length == 0 && (
        <p className="text-sm text-muted-foreground flex items-center">
          No files selected
        </p>
      )}
      <ul>
        {fileList.length > 0 &&
          fileList.map((file) => {
            const status = fileStatuses[file.id] || "waiting";
            const statusesColor = {
              failed: "text-red-500",
              uploaded: "text-green-500",
              uploading: "text-blue-500",
              waiting: "text-gray-500",
            };
            const statusColor = statusesColor[status] || "text-gray-500";
            return (
              <li key={file.id} className="flex flex-col mt-2">
                <div className="flex items-center justify-between gap-2 max-w-md">
                  <div className="flex items-center gap-2">
                    <Thumbnail file={file} width="32px" height="32px" />
                    <span>{file.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                      {formatFileSize(file.size || 0)}
                    </div>
                    {status !== "uploaded" && (
                      <Button
                        onClick={() => {
                          if (status === "failed") {
                            uppyContext?.uppy?.retryUpload(file.id);
                          } else {
                            uppyContext?.uppy?.removeFile(file.id);
                          }
                        }}
                        className="bg-transparent ml-4 text-red-500 cursor-pointer hover:bg-transparent focus:bg-transparent focus:ring-0"
                      >
                        {status === "failed" ? (
                          "Retry"
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span title="Remove file">
                                <AppIcon
                                  name="remove"
                                  className="text-red-500 size-4"
                                />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remove file</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
                <Field className="w-full max-w-md">
                  <FieldLabel htmlFor="progress-upload">
                    <span>Status - </span>
                    <span className={statusColor}>{status}</span>
                    <span className={`ml-auto ${statusColor}`}>
                      {file.progress.percentage ?? 0}%
                    </span>
                  </FieldLabel>
                  <Progress
                    className="rounded-sm"
                    value={file.progress.percentage ?? 0}
                    id="progress-upload"
                  />
                </Field>
              </li>
            );
          })}
      </ul>
    </>
  );
};
export default FilesList;

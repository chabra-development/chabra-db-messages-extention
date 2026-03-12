"use client";

import {
  AlertCircleIcon,
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  Trash2Icon,
  UploadIcon,
  VideoIcon,
  XIcon,
} from "lucide-react";
import {
  formatBytes,
  useFileUpload,
} from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";

function bytesToMB(bytes: number, decimals = 2): number {
  if (!bytes || bytes <= 0) return 0;

  const mb = bytes / (1024 * 1024);
  return Number(mb.toFixed(decimals));
}


const getFileIcon = (file: { file: File | { type: string; name: string } }) => {

  const fileType = file.file instanceof File ? file.file.type : file.file.type;
  const fileName = file.file instanceof File ? file.file.name : file.file.name;

  if (
    fileType.includes("pdf") ||
    fileName.endsWith(".pdf") ||
    fileType.includes("word") ||
    fileName.endsWith(".doc") ||
    fileName.endsWith(".docx")
  ) {
    return <FileTextIcon className="size-4 opacity-60" />;
  }
  if (
    fileType.includes("zip") ||
    fileType.includes("archive") ||
    fileName.endsWith(".zip") ||
    fileName.endsWith(".rar")
  ) {
    return <FileArchiveIcon className="size-4 opacity-60" />;
  }
  if (
    fileType.includes("excel") ||
    fileName.endsWith(".xls") ||
    fileName.endsWith(".xlsx")
  ) {
    return <FileSpreadsheetIcon className="size-4 opacity-60" />;
  }
  if (fileType.includes("video/")) {
    return <VideoIcon className="size-4 opacity-60" />;
  }
  if (fileType.includes("audio/")) {
    return <HeadphonesIcon className="size-4 opacity-60" />;
  }
  if (fileType.startsWith("image/")) {
    return <ImageIcon className="size-4 opacity-60" />;
  }
  return <FileIcon className="size-4 opacity-60" />;
};

export const UploadFile = () => {

  const maxSize = 50 * 1024 * 1024;
  const maxFiles = 10;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    initialFiles: [],
    maxFiles,
    maxSize,
    multiple: true,
  });

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      <div
        className="flex min-h-56 flex-col items-center not-data-[files]:justify-center rounded-xl border border-input border-dashed p-4 transition-colors has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50"
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          {...getInputProps()}
          aria-label="Upload files"
          className="sr-only"
        />

        {files.length > 0 ? (
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate font-medium text-sm">
                Arquivos importados ({files.length})
              </h3>
              <Button onClick={clearFiles} size="sm" variant="outline">
                <Trash2Icon
                  aria-hidden="true"
                  className="-ms-0.5 size-3.5 opacity-60"
                />
                Remover todos
              </Button>
            </div>
            <div className="w-full space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between gap-2 rounded-lg border bg-background p-2 pe-3"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
                      {getFileIcon(file)}
                    </div>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <p className="truncate w-100 font-medium text-base">
                        {file.file instanceof File
                          ? file.file.name
                          : file.file.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatBytes(
                          file.file instanceof File
                            ? file.file.size
                            : file.file.size,
                        )}
                      </p>
                    </div>
                  </div>

                  <Button
                    aria-label="Remove file"
                    className="-me-2 size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground"
                    onClick={() => removeFile(file.id)}
                    size="icon"
                    variant="ghost"
                  >
                    <XIcon aria-hidden="true" className="size-4" />
                  </Button>
                </div>
              ))}

              {files.length < maxFiles && (
                <Button
                  className="mt-2 w-full"
                  onClick={openFileDialog}
                  variant="outline"
                >
                  <UploadIcon aria-hidden="true" className="-ms-1 opacity-60" />
                  Adicionar mais arquivos
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <div
              aria-hidden="true"
              className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
            >
              <FileIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 font-medium text-sm">Upload files</p>
            <p className="text-muted-foreground text-xs">
              Maximo {maxFiles} arquivos ∙ Tamanho maximo {bytesToMB(maxSize)}MB
            </p>
            <Button className="mt-4" onClick={openFileDialog} variant="outline">
              <UploadIcon aria-hidden="true" className="-ms-1 opacity-60" />
              Selecionar arquivos
            </Button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="flex items-center gap-1 text-destructive text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}

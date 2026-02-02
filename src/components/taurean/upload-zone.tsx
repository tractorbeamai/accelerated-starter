"use client";

import { useCallback, useState } from "react";
import { Check, FileText, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  className?: string;
  disabled?: boolean;
}

export function UploadZone({
  onFileSelect,
  accept = ".pdf,.doc,.docx",
  className,
  disabled = false,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [disabled, onFileSelect],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [disabled, onFileSelect],
  );

  const clearFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return (
    <div className={cn("w-full", className)}>
      <AnimatePresence mode="wait">
        {selectedFile ? (
          <motion.div
            key="file-selected"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
                <FileText className="size-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-success/20">
                <Check className="size-3.5 text-success" />
              </div>
              <button
                type="button"
                onClick={clearFile}
                className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.label
            key="upload-zone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-white/20 bg-white/5 p-8 transition-all",
              isDragging && "border-accent bg-accent/5",
              disabled && "cursor-not-allowed opacity-50",
              !disabled && "hover:border-white/30 hover:bg-white/[0.07]",
            )}
          >
            <input
              type="file"
              accept={accept}
              onChange={handleFileInput}
              disabled={disabled}
              className="hidden"
            />
            <div
              className={cn(
                "mb-3 flex size-12 items-center justify-center rounded-full bg-white/10 transition-colors",
                isDragging && "bg-accent/20",
              )}
            >
              <Upload
                className={cn(
                  "size-5 text-muted-foreground transition-colors",
                  isDragging && "text-accent",
                )}
              />
            </div>
            <p className="mb-1 text-sm font-medium text-white">
              {isDragging
                ? "Drop your resume here"
                : "Drag and drop your resume"}
            </p>
            <p className="text-xs text-muted-foreground">
              PDF or DOCX, up to 10MB
            </p>
          </motion.label>
        )}
      </AnimatePresence>
    </div>
  );
}

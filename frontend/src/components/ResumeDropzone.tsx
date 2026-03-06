'use client';

import { useCallback, useState } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';

type Props = {
  onFile: (file: File) => void;
  disabled?: boolean;
};

export function ResumeDropzone({ onFile, disabled }: Props) {
  const [rejected, setRejected] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[], rejectedFiles: FileRejection[]) => {
      setRejected(null);
      if (accepted.length) {
        onFile(accepted[0]);
      } else if (rejectedFiles.length && rejectedFiles[0].errors.length) {
        setRejected(rejectedFiles[0].errors[0].message);
      }
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled,
  });

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-slate-300 bg-slate-50/50 hover:border-primary-400'}
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <p className="text-slate-600">
          {isDragActive ? 'Drop your PDF here' : 'Drag & drop your resume PDF here, or click to select'}
        </p>
        <p className="text-sm text-slate-400 mt-1">Max 5MB, PDF only</p>
      </div>
      {rejected && <p className="text-red-600 text-sm">{rejected}</p>}
    </div>
  );
}

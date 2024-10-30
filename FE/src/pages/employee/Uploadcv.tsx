import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const FileUploadWithCustomDropzone: React.FC = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div style={{ width: "300px", margin: "auto" }}>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #0087F7",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: isDragActive ? "#e0e0e0" : "#f9f9f9",
        }}
      >
        <input {...getInputProps()} />
        <p>{isDragActive ? "Thả file vào đây..." : "Kéo thả file vào đây hoặc nhấn để chọn"}</p>
      </div>

     
      {/* Hiển thị ảnh xem trước */}
      {previewUrl && (
        <div style={{ marginTop: "10px" }}>
          <p>Xem trước ảnh:</p>
          <img src={previewUrl} alt="Preview" style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }} />
        </div>
      )}
    </div>
  );
};

export default FileUploadWithCustomDropzone;

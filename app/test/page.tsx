"use client";

import { useState } from "react";

export default function TestPage() {
  const [file, setFile] = useState<File | null>(null);

  const URL =
    "https://litedrive.s3.tebi.io/573221b4-001c-4802-8777-913418dd00f5?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=DpyqCQGQpwGHyklp%2F20260108%2Fglobal%2Fs3%2Faws4_request&X-Amz-Date=20260108T151831Z&X-Amz-Expires=6000&X-Amz-Signature=3607e124ac110329db752f4de77f83d3f658935cc4290f6d3680c08ac4ce6fb8&X-Amz-SignedHeaders=host&x-amz-checksum-crc32=AAAAAA%3D%3D&x-amz-sdk-checksum-algorithm=CRC32&x-id=PutObject";

  const handleSubmit = async () => {
    await fetch(URL, { method: "PUT", body: file });
  };

  return (
    <main>
      <input
        type="file"
        onChange={(e) => {
          if (!e.target.files || e.target.files?.length === 0) return;

          setFile(e.target.files[0]);
        }}
      />
      <button onClick={handleSubmit}>제출</button>
    </main>
  );
}

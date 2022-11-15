import React from "react";
import axios from "axios";
import { useMutation } from "react-query";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const { mutate, isLoading } = useMutation(() => uploadFile(file, url), {
    onSuccess: () => {
      setFile(undefined);
    },
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={() => mutate()} disabled={isLoading}>
            Upload file
          </button>
        </div>
      )}
    </Box>
  );
}

async function uploadFile(file: File | undefined, url: string) {
  if (!file) {
    return;
  }
  const token = localStorage.getItem("authorization_token");

  // Get the presigned URL
  const response = await axios({
    method: "GET",
    url,
    params: {
      name: encodeURIComponent(file.name),
    },
    headers: {
      Authorization: token ? `Basic ${token}` : undefined,
    },
  });
  console.log("File to upload: ", file.name);
  console.log("Uploading to: ", response.data);
  const result = await fetch(response.data.url, {
    method: "PUT",
    body: file,
  });
  console.log("Result: ", result);
}

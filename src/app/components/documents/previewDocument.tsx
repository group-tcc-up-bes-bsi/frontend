import React, { useEffect, useState } from "react";
import { Box, Modal, Typography, useTheme } from "@mui/material";
import { Close } from "@mui/icons-material";

interface PreviewDocumentProps {
  file: File;
  onClose: () => void;
}

const PreviewDocument: React.FC<PreviewDocumentProps> = ({ file, onClose }) => {
  const [url, setUrl] = useState("");
  const theme = useTheme();

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const type = file.type;
  const name = file.name.toLowerCase();

  const isWord = type.includes("word") || name.endsWith(".doc") || name.endsWith(".docx");
  const isExcel = type.includes("excel") || name.endsWith(".xls") || name.endsWith(".xlsx");

  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: theme.palette.background.paper,
          boxShadow: 24,
          p: 2,
          borderRadius: "8px",
          width: "80%",
          height: "90%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="h6">Pré-visualização</Typography>
          <Close
            onClick={onClose}
            sx={{
              fontSize: 30,
              color: theme.palette.text.primary,
              cursor: 'pointer',
              '&:hover': {
                color: theme.palette.error.main,
              }
            }}
          />
        </Box>
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {type.includes("pdf") && <iframe src={url} width="100%" height="100%" />}

          {(type.includes("png") ||
            type.includes("jpeg") ||
            type.includes("jpg") ||
            type.includes("bmp")) && (
              <img src={url} alt="preview" style={{ maxWidth: "100%", maxHeight: "100%" }} />
            )}

          {(type.includes("text") || type.includes("json")) && (
            <iframe src={url} width="100%" height="100%" />
          )}

          {isWord && (
            <Typography sx={{ mt: 2, textAlign: "center" }}>
              Pré-visualização de arquivos DOCX não é suportado.
            </Typography>
          )}

          {isExcel && (
            <Typography sx={{ mt: 2, textAlign: "center" }}>
              Pré-visualização de arquivos XLSX não é suportado.
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default PreviewDocument;

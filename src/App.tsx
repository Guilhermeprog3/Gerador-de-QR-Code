import React, { useState } from "react";
import QRCode from "react-qr-code";

const App: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [qrData, setQrData] = useState<string | null>(null);

  const generateQRCode = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      setQrData(JSON.stringify(parsedJson));
    } catch (error) {
      alert("JSON inválido! Verifique a formatação.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "2rem",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        maxWidth: "400px",
        width: "100%",
        margin: "0 auto",
      }}
    >
      <h1 style={{ color: "#333", marginBottom: "1rem" }}>Gerador de QR Code</h1>
      <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
        Insira um JSON válido no campo abaixo e clique em "Gerar QR Code".
      </p>
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        style={{
          width: "100%",
          height: "120px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          fontFamily: "monospace",
          fontSize: "0.9rem",
          marginBottom: "1.5rem",
          resize: "none",
        }}
      />
      <button
        onClick={generateQRCode}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          fontSize: "1rem",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
      >
        Gerar QR Code
      </button>

      {qrData && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <QRCode value={qrData} size={200} />
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "1rem" }}>
            Escaneie o QR Code acima.
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
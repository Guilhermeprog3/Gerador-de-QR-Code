"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, RefreshCw, Palette, Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppTheme } from "@/context/themecontext";
import { toast } from "sonner";

const QrCodeCardContent = ({
  idPrefix,
  qrValue,
  error,
  size,
  setSize,
  qrCodeTitle,
  setQrCodeTitle,
  theme,
}: {
  idPrefix: string;
  qrValue: string;
  error: string | null;
  size: number;
  setSize: (size: number) => void;
  qrCodeTitle: string;
  setQrCodeTitle: (title: string) => void;
  theme: any;
}) => (
  <>
    <div className="bg-white p-4 rounded-lg shadow-md">
      {qrValue && !error ? (
        <QRCodeSVG
          id={`${idPrefix}-svg`}
          value={qrValue}
          size={size}
          level="H"
          includeMargin={true}
          fgColor={theme.qrCodeColor}
        />
      ) : (
        <div
          className="flex items-center justify-center border-2 border-dashed rounded-lg"
          style={{ width: size, height: size, borderColor: theme.lightGray }}
        >
          <p className="text-center p-4" style={{ color: theme.textSecondary }}>
            {error
              ? "Corrija os dados para gerar o QR Code"
              : "Aguardando dados válidos..."}
          </p>
        </div>
      )}
    </div>

    <div className="w-full max-w-xs space-y-4">
      <div>
        <Label htmlFor="qrTitle" style={{ color: theme.textSecondary }} className="text-xs">
          Título do Arquivo (Opcional)
        </Label>
        <Input
          id="qrTitle"
          value={qrCodeTitle}
          onChange={(e) => setQrCodeTitle(e.target.value)}
          placeholder="Ex: qrcode_sala_101"
          style={{
            background: theme.primaryLight,
            color: theme.textPrimary,
            borderColor: "rgba(255,255,255,0.2)",
          }}
          className="mt-1"
        />
      </div>

      <Tabs defaultValue={size.toString()} className="w-full">
        <TabsList className="grid grid-cols-3" style={{ background: theme.navBarBackground }}>
          <TabsTrigger onClick={() => setSize(128)} value="128">
            Pequeno
          </TabsTrigger>
          <TabsTrigger onClick={() => setSize(256)} value="256">
            Médio
          </TabsTrigger>
          <TabsTrigger onClick={() => setSize(512)} value="512">
            Grande
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  </>
);


export default function QRCodeGenerator() {
  const { theme, setTheme } = useAppTheme();
  const [jsonInput, setJsonInput] = useState(
    '{\n  "exemplo": "Olá Mundo",\n  "teste": 123\n}'
  );
  const [jsonQrValue, setJsonQrValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState(256);
  const [activeTab, setActiveTab] = useState("json");
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [objectQrValue, setObjectQrValue] = useState("");

  const [qrCodeTitle, setQrCodeTitle] = useState("");

  useEffect(() => {
    validateAndUpdateQR(jsonInput);
  }, [jsonInput]);

  useEffect(() => {
    if (title || location) {
      const objectData = { title, location };
      setObjectQrValue(JSON.stringify(objectData));
    } else {
      setObjectQrValue("");
    }
  }, [title, location]);

  const validateAndUpdateQR = (input: string) => {
    if (!input.trim()) {
      setError("O JSON não pode estar vazio.");
      setJsonQrValue("");
      return;
    }
    try {
      const parsedJson = JSON.parse(input);
      const jsonString = JSON.stringify(parsedJson, null, 2);
      setJsonQrValue(jsonString);
      setError(null);
    } catch (err) {
      setError("JSON inválido. Verifique a sintaxe.");
    }
  };

  const handleDownload = (value: string, prefix = "qrcode") => {
    const svg = document.getElementById(`${prefix}-svg`);
    if (!svg) {
      toast.error("Erro ao encontrar o QR Code para download.");
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      toast.error("Não foi possível criar o canvas para download.");
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      
      const sanitizedTitle = qrCodeTitle.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileName = sanitizedTitle || prefix;

      downloadLink.download = `${fileName}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      toast.success("Download do QR Code iniciado!");
    };
    img.onerror = () => {
      toast.error("Falha ao carregar a imagem do QR Code.");
    };
    img.src = "data:image/svg+xml;base64," + btoa(decodeURIComponent(encodeURIComponent(svgData)));
  };

  const ThemeSwitcherModal = () => (
    <Dialog open={isThemeModalOpen} onOpenChange={setIsThemeModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" style={{ borderColor: theme.secondary, color: theme.secondary }}>
          <Palette className="mr-2 h-4 w-4" />
          Trocar Tema
        </Button>
      </DialogTrigger>
      <DialogContent style={{ background: theme.primaryLight, borderColor: theme.secondary }}>
        <DialogHeader>
          <DialogTitle style={{ color: theme.textPrimary }}>Selecione um Tema</DialogTitle>
          <DialogDescription style={{ color: theme.textSecondary }}>
            Escolha uma aparência para a aplicação. A configuração do seu sistema é o padrão.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 pt-4">
            <Button variant="outline" size="lg" onClick={() => { setTheme("secondary"); setIsThemeModalOpen(false); }} style={{color: '#2e7d32'}}>
                <Paintbrush className="mr-2 h-4 w-4"/> Padrão Claro (Verde)
            </Button>
            <Button variant="outline" size="lg" onClick={() => { setTheme("tertiary"); setIsThemeModalOpen(false); }} style={{color: '#4caf50'}}>
                <Paintbrush className="mr-2 h-4 w-4"/> Padrão Escuro (Verde)
            </Button>
            <Button variant="outline" size="lg" onClick={() => { setTheme("primary"); setIsThemeModalOpen(false); }} style={{color: '#00b09b'}}>
                <Paintbrush className="mr-2 h-4 w-4"/> Bônus (Azul)
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const cardStyle = {
    background: theme.primaryDark,
    borderColor: theme.navBarBackground,
    color: theme.textPrimary,
  };

  const inputStyle = {
    background: theme.primaryLight,
    color: theme.textPrimary,
    borderColor: "rgba(255,255,255,0.2)",
  };

  return (
    <div
      className="min-h-screen w-full transition-all duration-300"
      style={{
        background: `linear-gradient(to bottom, ${theme.gradientStart}, ${theme.gradientEnd})`,
        color: theme.textPrimary,
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-center" style={{ color: theme.textPrimary }}>
            Gerador de QR Code
          </h1>
          <ThemeSwitcherModal />
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className="grid w-full grid-cols-2 mb-8"
            style={{ background: theme.navBarBackground, color: theme.textPrimary }}
          >
            <TabsTrigger value="json">QR Code a partir de JSON</TabsTrigger>
            <TabsTrigger value="object">QR Code a partir de Objeto</TabsTrigger>
          </TabsList>

          <TabsContent value="json">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card style={cardStyle}>
                <CardHeader>
                  <CardTitle>Entrada JSON</CardTitle>
                  <CardDescription style={{ color: theme.textSecondary }}>
                    Digite ou cole seu JSON abaixo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                    placeholder="Digite seu JSON aqui..."
                    style={inputStyle}
                  />
                  {error && (
                    <Alert
                      variant="destructive"
                      className="mt-4"
                      style={{ background: "rgba(219, 68, 55, 0.2)", borderColor: theme.red }}
                    >
                      <AlertTitle>Erro</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => validateAndUpdateQR(jsonInput)}
                    className="w-full"
                    style={{ background: theme.buttonBackground, color: theme.buttonText }}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Atualizar QR Code
                  </Button>
                </CardFooter>
              </Card>

              <Card style={cardStyle}>
                <CardHeader>
                  <CardTitle>QR Code Gerado</CardTitle>
                  <CardDescription style={{ color: theme.textSecondary }}>
                    Escaneie ou faça o download
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4">
                   <QrCodeCardContent 
                     idPrefix="json-qrcode"
                     qrValue={jsonQrValue}
                     error={error}
                     size={size}
                     setSize={setSize}
                     qrCodeTitle={qrCodeTitle}
                     setQrCodeTitle={setQrCodeTitle}
                     theme={theme}
                   />
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleDownload(jsonQrValue, "json-qrcode")}
                    className="w-full"
                    disabled={!!error || !jsonQrValue}
                    style={{ background: theme.buttonBackground, color: theme.buttonText }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Baixar QR Code
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="object">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card style={cardStyle}>
                    <CardHeader>
                        <CardTitle>Dados do Objeto</CardTitle>
                         <CardDescription style={{ color: theme.textSecondary }}>
                            Preencha os campos para gerar um QR Code
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="title" style={{ color: theme.textPrimary }}>Título</Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Mesa de Escritório" style={inputStyle}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location" style={{ color: theme.textPrimary }}>Localização</Label>
                            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ex: Sala 101" style={inputStyle} />
                        </div>
                        <div className="p-4 rounded-md mt-4" style={{ background: theme.primaryLight, borderColor: theme.secondary }}>
                            <p className="text-sm font-mono mb-2" style={{ color: theme.textSecondary }}>
                                JSON Gerado:
                            </p>
                            <pre className="text-xs overflow-auto p-2 rounded" style={{
                                background: theme.primaryDark,
                                borderColor: theme.secondary,
                                color: theme.secondary,
                            }}>
                                {JSON.stringify({ title, location }, null, 2)}
                            </pre>
                        </div>
                    </CardContent>
                </Card>
                 <Card style={cardStyle}>
                    <CardHeader>
                        <CardTitle>QR Code do Objeto</CardTitle>
                        <CardDescription style={{ color: theme.textSecondary }}>
                            Escaneie ou faça o download
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center gap-4">
                      <QrCodeCardContent 
                        idPrefix="object-qrcode"
                        qrValue={objectQrValue}
                        error={null}
                        size={size}
                        setSize={setSize}
                        qrCodeTitle={qrCodeTitle}
                        setQrCodeTitle={setQrCodeTitle}
                        theme={theme}
                      />
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={() => handleDownload(objectQrValue, "object-qrcode")}
                            className="w-full"
                            disabled={!objectQrValue}
                            style={{ background: theme.buttonBackground, color: theme.buttonText }}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Baixar QR Code
                        </Button>
                    </CardFooter>
                 </Card>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
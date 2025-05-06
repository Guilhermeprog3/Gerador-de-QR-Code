"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const hidro = {
  primaryDark: "#01002C",
  primaryLight: "#000481",
  secondary: "#00bfa5",
  white: "#fff",
  lightGray: "#d3d3d3",
  red: "#DB4437",
  gradientStart: "#01002C",
  gradientEnd: "#000481",
  buttonBackground: "#00bfa5",
  buttonText: "#fff",
  textPrimary: "#fff",
  textSecondary: "#d3d3d3",
  navBarBackground: "#00036A",
  iconColor: "#fff",
  navBarIconColor: "#fff",
  gradientstartlogin: "#01002C",
  gradientendlogin: "#000481",
}

export default function QRCodeGenerator() {
  const [jsonInput, setJsonInput] = useState('{\n  "exemplo": "Olá Mundo",\n  "teste": 123\n}')
  const [qrValue, setQrValue] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [size, setSize] = useState(256)

  const [tittle, setTittle] = useState("")
  const [location, setLocation] = useState("")
  const [objectQrValue, setObjectQrValue] = useState("")

  useEffect(() => {
    validateAndUpdateQR(jsonInput)
  }, [jsonInput])

  useEffect(() => {
    if (tittle || location) {
      const objectData = {
        tittle,
        location,
      }
      setObjectQrValue(JSON.stringify(objectData))
    }
  }, [tittle, location])

  const validateAndUpdateQR = (input: string) => {
    try {
      const parsedJson = JSON.parse(input)
      const jsonString = JSON.stringify(parsedJson)
      setQrValue(jsonString)
      setError(null)
    } catch (err) {
      setError("JSON inválido. Verifique a sintaxe.")
    }
  }

  const handleDownload = (value: string, prefix = "qrcode") => {
    const svg = document.getElementById(`${prefix}-svg`)
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      canvas.width = size
      canvas.height = size
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")

      const downloadLink = document.createElement("a")
      downloadLink.download = `${prefix}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  const handleRefresh = () => {
    validateAndUpdateQR(jsonInput)
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(to bottom, ${hidro.gradientStart}, ${hidro.gradientEnd})`,
        color: hidro.textPrimary,
      }}
    >
      <Tabs defaultValue="json" className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-8" style={{ color: hidro.white }}>
          Gerador de QR Code
        </h1>

        <TabsList
          className="grid w-full grid-cols-2 mb-8"
          style={{
            background: hidro.navBarBackground,
          }}
        >
          <TabsTrigger
            value="json"
            style={
              {
                color: hidro.textPrimary,
                "--tab-accent": hidro.secondary,
              } as React.CSSProperties
            }
            className="data-[state=active]:bg-opacity-50 data-[state=active]:text-white"
          >
            QR Code a partir de JSON
          </TabsTrigger>
          <TabsTrigger
            value="object"
            style={
              {
                color: hidro.textPrimary,
                "--tab-accent": hidro.secondary,
              } as React.CSSProperties
            }
            className="data-[state=active]:bg-opacity-50 data-[state=active]:text-white"
          >
            QR Code de Objeto
          </TabsTrigger>
        </TabsList>

        <TabsContent value="json">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card
              style={{
                background: hidro.primaryDark,
                borderColor: hidro.primaryLight,
                color: hidro.textPrimary,
              }}
            >
              <CardHeader>
                <CardTitle style={{ color: hidro.white }}>Entrada JSON</CardTitle>
                <CardDescription style={{ color: hidro.textSecondary }}>Digite ou cole seu JSON abaixo</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="min-h-[300px] font-mono"
                  placeholder="Digite seu JSON aqui..."
                  style={{
                    background: hidro.primaryLight,
                    color: hidro.white,
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                />
                {error && (
                  <Alert
                    variant="destructive"
                    className="mt-4"
                    style={{ background: "rgba(219, 68, 55, 0.2)", borderColor: hidro.red }}
                  >
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleRefresh}
                  className="w-full"
                  style={{
                    background: hidro.buttonBackground,
                    color: hidro.buttonText,
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Atualizar QR Code
                </Button>
              </CardFooter>
            </Card>

            <Card
              style={{
                background: hidro.primaryDark,
                borderColor: hidro.primaryLight,
                color: hidro.textPrimary,
              }}
            >
              <CardHeader>
                <CardTitle style={{ color: hidro.white }}>QR Code Gerado</CardTitle>
                <CardDescription style={{ color: hidro.textSecondary }}>
                  Escaneie ou faça download do QR Code
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <Tabs defaultValue="256" className="w-full mb-6">
                  <TabsList className="grid grid-cols-3" style={{ background: hidro.navBarBackground }}>
                    <TabsTrigger
                      value="128"
                      onClick={() => setSize(128)}
                      style={{ color: hidro.textPrimary }}
                      className="data-[state=active]:bg-opacity-50"
                    >
                      Pequeno
                    </TabsTrigger>
                    <TabsTrigger
                      value="256"
                      onClick={() => setSize(256)}
                      style={{ color: hidro.textPrimary }}
                      className="data-[state=active]:bg-opacity-50"
                    >
                      Médio
                    </TabsTrigger>
                    <TabsTrigger
                      value="512"
                      onClick={() => setSize(512)}
                      style={{ color: hidro.textPrimary }}
                      className="data-[state=active]:bg-opacity-50"
                    >
                      Grande
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="bg-white p-4 rounded-lg">
                  {!error && qrValue ? (
                    <QRCodeSVG
                      id="qrcode-svg"
                      value={qrValue}
                      size={size}
                      level="H"
                      includeMargin={true}
                      fgColor={hidro.primaryDark}
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg"
                      style={{ width: size, height: size }}
                    >
                      <p className="text-gray-500 text-center p-4">
                        {error ? "Corrija o JSON para gerar o QR Code" : "Digite um JSON válido"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleDownload(qrValue)}
                  className="w-full"
                  disabled={!!error || !qrValue}
                  style={{
                    background: hidro.buttonBackground,
                    color: hidro.buttonText,
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar QR Code
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="object">
          <div className="rounded-lg p-8" style={{ background: hidro.primaryDark }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card
                style={{
                  background: hidro.primaryLight,
                  borderColor: "rgba(255,255,255,0.1)",
                  color: hidro.textPrimary,
                }}
              >
                <CardHeader>
                  <CardTitle style={{ color: hidro.white }}>Dados do Objeto</CardTitle>
                  <CardDescription style={{ color: hidro.textSecondary }}>Preencha os campos abaixo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tittle" style={{ color: hidro.white }}>
                        Título
                      </Label>
                      <Input
                        id="tittle"
                        value={tittle}
                        onChange={(e) => setTittle(e.target.value)}
                        placeholder="Digite o título do objeto"
                        style={{
                          background: "rgba(255,255,255,0.1)",
                          borderColor: "rgba(255,255,255,0.2)",
                          color: hidro.white,
                        }}
                        className="placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" style={{ color: hidro.white }}>
                        Localização
                      </Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Digite a localização do objeto"
                        style={{
                          background: "rgba(255,255,255,0.1)",
                          borderColor: "rgba(255,255,255,0.2)",
                          color: hidro.white,
                        }}
                        className="placeholder:text-gray-400"
                      />
                    </div>

                    <div className="p-4 rounded-md mt-4" style={{ background: "rgba(0,0,0,0.2)" }}>
                      <p className="text-sm font-mono mb-2" style={{ color: hidro.textSecondary }}>
                        JSON gerado:
                      </p>
                      <pre
                        className="text-xs overflow-auto p-2 rounded border"
                        style={{
                          background: hidro.primaryDark,
                          borderColor: "rgba(255,255,255,0.1)",
                          color: hidro.secondary,
                        }}
                      >
                        {objectQrValue || '{\n  "title": "",\n  "location": ""\n}'}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                style={{
                  background: hidro.primaryLight,
                  borderColor: "rgba(255,255,255,0.1)",
                  color: hidro.textPrimary,
                }}
              >
                <CardHeader>
                  <CardTitle style={{ color: hidro.white }}>QR Code do Objeto</CardTitle>
                  <CardDescription style={{ color: hidro.textSecondary }}>
                    Escaneie ou faça download do QR Code
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  <Tabs defaultValue="256" className="w-full mb-6">
                    <TabsList className="grid grid-cols-3" style={{ background: hidro.navBarBackground }}>
                      <TabsTrigger
                        value="128"
                        onClick={() => setSize(128)}
                        style={{ color: hidro.textPrimary }}
                        className="data-[state=active]:bg-opacity-50"
                      >
                        Pequeno
                      </TabsTrigger>
                      <TabsTrigger
                        value="256"
                        onClick={() => setSize(256)}
                        style={{ color: hidro.textPrimary }}
                        className="data-[state=active]:bg-opacity-50"
                      >
                        Médio
                      </TabsTrigger>
                      <TabsTrigger
                        value="512"
                        onClick={() => setSize(512)}
                        style={{ color: hidro.textPrimary }}
                        className="data-[state=active]:bg-opacity-50"
                      >
                        Grande
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="bg-white p-4 rounded-lg">
                    {objectQrValue ? (
                      <QRCodeSVG
                        id="object-svg"
                        value={objectQrValue}
                        size={size}
                        level="H"
                        includeMargin={true}
                        fgColor={hidro.primaryDark}
                      />
                    ) : (
                      <div
                        className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg"
                        style={{ width: size, height: size }}
                      >
                        <p className="text-gray-500 text-center p-4">Preencha os campos para gerar o QR Code</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleDownload(objectQrValue, "object-qrcode")}
                    className="w-full"
                    disabled={!objectQrValue}
                    style={{
                      background: hidro.buttonBackground,
                      color: hidro.buttonText,
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Baixar QR Code
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

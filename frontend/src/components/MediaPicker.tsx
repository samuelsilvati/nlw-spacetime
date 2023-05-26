'use client' // Permite o código abaixo ser executado diretamente no navegador
import { ChangeEvent, useState } from 'react'

interface MediaPickerProps {
  onPreviewChange: (preview: string | null) => void
}

export function MediaPicker({ onPreviewChange }: MediaPickerProps) {
  const [preview, setPreview] = useState<string | null>(null)
  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files) {
      return
    }

    const previewURL = URL.createObjectURL(files[0])

    setPreview(previewURL)
    onPreviewChange(previewURL) // Chama a função de retorno de chamada com o novo valor de preview
  }

  return (
    <>
      <input
        onChange={onFileSelected}
        name="coverUrl"
        type="file"
        id="media"
        accept="image/*"
        className="invisible h-0 w-0"
      />
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt=""
          className="rouded-lg aspect-video w-full object-cover"
        />
      )}
    </>
  )
}

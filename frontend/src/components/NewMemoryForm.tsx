'use client' // Permite o código abaixo ser executado diretamente no navegador

import { MediaPicker } from '@/components/MediaPicker'
import { api } from '@/lib/api'
// import axios from 'axios'
import { Camera } from 'lucide-react'
import { FormEvent, useState } from 'react'
import Cookie from 'js-cookie'
import { useRouter } from 'next/navigation'
import Loading from './Loading'

export function NewMemoryForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleCreateMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)

    const fileToUpload = formData.get('coverUrl')

    let coverUrl = ''

    if (fileToUpload instanceof File && fileToUpload.name !== '') {
      const uploadFormData = new FormData()
      uploadFormData.set('file', fileToUpload)

      uploadFormData.set('fileName', fileToUpload.name)
      uploadFormData.set('folder', 'nlw-spacetime')

      const uploadResponse = await api.post(
        `${process.env.NEXT_PUBLIC_IMAGEKIT_UPLOAD_URL}`,
        uploadFormData,
        {
          headers: {
            Authorization: `Basic ${process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY}`,
          },
        },
      )

      coverUrl = uploadResponse.data.url
    }

    const token = Cookie.get('token')

    await api.post(
      '/memories/',
      {
        coverUrl,
        content: formData.get('content'),
        isPublic: formData.get('isPublic'),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    router.push('/')
    setLoading(false)
  }

  if (loading) return <Loading isLoading={loading} />

  return (
    <form
      onSubmit={handleCreateMemory}
      className="flex h-screen flex-1 flex-col gap-2"
    >
      <Loading isLoading={false} />
      <div className="flex items-center gap-4">
        <label
          htmlFor="media"
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <Camera className="h-4 w-4" />
          Anexar mídia
        </label>
        <label
          htmlFor="isPublic"
          className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            value="true"
            className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500"
          />
          Tornar memória pública
        </label>
      </div>
      <MediaPicker onPreviewChange={() => {}} />
      <textarea
        name="content"
        spellCheck={false}
        className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
        placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
      />
      <button
        type="submit"
        className="inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
      >
        Salvar
      </button>
    </form>
  )
}

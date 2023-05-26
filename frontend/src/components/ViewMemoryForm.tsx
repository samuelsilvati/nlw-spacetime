/* eslint-disable @next/next/no-img-element */
'use client' // Permite o código abaixo ser executado diretamente no navegador

import { MediaPicker } from '@/components/MediaPicker'
import { api } from '@/lib/api'
import { Camera, Trash2 } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import Cookie from 'js-cookie'

interface MemoryProps {
  id: string
}

interface MemoryDataProps {
  id: string
  coverUrl: string
  content: string
  name: string
}

export function ViewMemoryForm(id: MemoryProps) {
  const [memoryData, setMemoryData] = useState<MemoryDataProps | null>(null)
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null)

  const handlePreviewChange = (previewValue: string | null) => {
    setSelectedPreview(previewValue)
  }

  async function handleEditMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const fileToUpload = formData.get('coverUrl')

    let coverUrl = ''

    if (fileToUpload instanceof File && fileToUpload.name !== '') {
      const uploadFormData = new FormData()
      uploadFormData.set('file', fileToUpload)

      const uploadResponse = await api.post('/upload', uploadFormData)

      coverUrl = uploadResponse.data.fileUrl
    } else {
      coverUrl = `${memoryData?.coverUrl}`
    }

    const token = Cookie.get('token')

    await api.put(
      `/memories/${id.id}`,
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
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookie.get('token')

        const response = await api.get(`/memories/${id.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data) {
          setMemoryData(response.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    if (id) {
      fetchData()
    }
  }, [id, id.id])

  return (
    <form onSubmit={handleEditMemory} className="flex flex-1 flex-col gap-2">
      <div className="flex flex-row justify-between">
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
        <div>
          <button
            type="submit"
            className="inline-block self-end rounded-full bg-orange-500 p-3 font-alt text-sm uppercase leading-none text-black hover:bg-orange-600"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <MediaPicker onPreviewChange={handlePreviewChange} />

      {selectedPreview ? (
        ''
      ) : (
        <img
          src={memoryData?.coverUrl}
          alt=""
          className="rouded-lg aspect-video w-full object-cover"
        />
      )}

      <textarea
        name="content"
        spellCheck={false}
        className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
        placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        value={`${memoryData?.content}`}
        onChange={(event) =>
          setMemoryData((prevData) => {
            return {
              ...(prevData || {}), // Certifica-se de que prevData não é nulo
              content: event.target.value,
            } as MemoryDataProps
          })
        }
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

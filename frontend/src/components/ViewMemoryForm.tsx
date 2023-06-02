/* eslint-disable @next/next/no-img-element */
'use client' // Permite o código abaixo ser executado diretamente no navegador

import { MediaPicker } from '@/components/MediaPicker'
import { api } from '@/lib/api'
import { Camera, Trash2 } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import Cookie from 'js-cookie'
import { useRouter } from 'next/navigation'
import Loading from './Loading'

interface MemoryProps {
  id: string
}

interface MemoryDataProps {
  id: string
  coverUrl: string
  content: string
}

export function ViewMemoryForm(id: MemoryProps) {
  const router = useRouter()
  const [memoryData, setMemoryData] = useState<MemoryDataProps | null>(null)
  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(false)
  const [isPress, setIsPress] = useState(false)
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null)

  const handlePreviewChange = (previewValue: string | null) => {
    setSelectedPreview(previewValue)
  }

  const token = Cookie.get('token')

  async function handleDeleteMemory() {
    try {
      setLoading(true)
      await api.delete(`/memories/${id.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setLoading(false)
      router.push('/')
    } catch (err) {
      setLoading(false)
      console.log(err)
    }
  }

  async function handleEditMemory(event: FormEvent<HTMLFormElement>) {
    setLoading(true)
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
    setLoading(false)
    setIsPress(false)
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
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error('Error fetching data:', error)
      }
    }
    if (id) {
      fetchData()
    }
  }, [id, id.id])

  if (loading) return <Loading isLoading={loading} />

  return (
    <form onSubmit={handleEditMemory} className="flex flex-1 flex-col gap-2">
      <Loading isLoading={false} />

      {show ? (
        <div className="absolute bottom-0 left-0 flex h-full w-full items-center justify-center  bg-black/20 backdrop-blur-sm transition-opacity">
          <div className="flex h-40 w-80 flex-col justify-between rounded border border-gray-400 bg-gray-800 p-5">
            <p className="pt-5 text-center">
              Tem certeza que deseja excluir essa memória?
            </p>
            <div className="flex w-full items-center justify-center gap-7">
              <button
                type="button"
                className="inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
                onClick={() => {
                  setShow(false)
                }}
              >
                Voltar
              </button>
              <button
                type="button"
                className="inline-block self-end rounded-full bg-orange-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-orange-600"
                onClick={handleDeleteMemory}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}

      <div className="flex flex-row justify-between">
        <div className="flex flex-col items-start gap-4 xl:flex-row xl:items-center">
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
          {!isPress ? (
            <button
              className="text-gray-200 hover:text-gray-100 hover:underline"
              onClick={() => {
                setIsPress(true)
              }}
            >
              Editar memória
            </button>
          ) : (
            ''
          )}
        </div>
      </div>

      <MediaPicker onPreviewChange={handlePreviewChange} />

      {selectedPreview ? (
        <div />
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

      {isPress ? (
        <div className="m-0 flex w-full items-center justify-end gap-4">
          <button
            type="button"
            className="inline-block self-end rounded-full bg-orange-500 p-3 text-black hover:bg-orange-600"
            onClick={() => {
              setShow(true)
            }}
          >
            <Trash2 size={18} />
          </button>
          <button
            type="submit"
            className="inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
          >
            Salvar
          </button>
        </div>
      ) : (
        ''
      )}
    </form>
  )
}

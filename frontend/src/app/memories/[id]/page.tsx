// import { EditMemoryForm } from '@/components/EditMemoryForm'
import { ViewMemoryForm } from '@/components/ViewMemoryForm'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

interface MemoryProps {
  params: {
    id: string
  }
}

export default function IdMemory({ params }: MemoryProps) {
  return (
    <div className="relative flex flex-1 flex-col gap-4 p-10 xl:p-16">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
        voltar à timeline
      </Link>
      <ViewMemoryForm id={params.id} />
    </div>
  )
}

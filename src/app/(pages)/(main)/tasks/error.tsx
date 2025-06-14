'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className='flex items-center justify-center w-full h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col items-center'>
        <h1 className='text-2xl font-bold text-red-600'>发生错误</h1>
        <p className='mt-4 text-gray-700'>{error.message}</p>
        <button
          onClick={() => reset()}
          className='mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
        >
          重试
        </button>
      </div>
    </div>
  )
}
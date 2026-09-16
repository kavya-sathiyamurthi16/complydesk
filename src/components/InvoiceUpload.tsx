import { Upload, FileText, X } from 'lucide-react'
import { useState } from 'react'

interface InvoiceUploadProps {
  onUpload: (file: File) => void
  isUploading?: boolean
}

export function InvoiceUpload({ onUpload, isUploading = false }: InvoiceUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setSelectedFile(file)
      onUpload(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      onUpload(file)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
  }

  const handleTestSample = () => {
    // Create a mock file for testing
    const mockFile = new File(['mock invoice data'], 'test-sample-invoice.pdf', { type: 'application/pdf' })
    setSelectedFile(mockFile)
    onUpload(mockFile)
  }

  return (
    <div className="space-y-4">
      {/* Upload area */}
      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-12 text-center transition-colors
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-blue-50 rounded-full">
              <Upload size={32} className="text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900 mb-1">
                Upload Logistics Invoice
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Drag and drop your invoice here, or click to browse
              </p>
              <p className="text-xs text-gray-400">
                Supported formats: PDF, JPG, PNG, CSV
              </p>
            </div>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.csv"
              onChange={handleFileChange}
              className="hidden"
              id="invoice-upload"
              disabled={isUploading}
            />
            <label
              htmlFor="invoice-upload"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium"
            >
              Choose File
            </label>
          </div>
        </div>
      ) : (
        /* Selected file display */
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Remove file"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Test sample option */}
      {!selectedFile && !isUploading && (
        <div className="text-center">
          <button
            onClick={handleTestSample}
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            Test with Sample Invoice
          </button>
        </div>
      )}
    </div>
  )
}
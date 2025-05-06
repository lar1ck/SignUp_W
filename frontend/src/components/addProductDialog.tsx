import { useId, useState, useEffect } from "react"
import { ImagePlusIcon, XIcon } from "lucide-react"
import { useFileUpload } from "../hooks/use-file-upload"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Product } from "../types/Product" 

interface AddProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (newProduct: Omit<Product, 'id' | 'date_added' | 'date_modified'>) => void
}

export default function AddProductDialog({ 
  open,
  onOpenChange,
  onSave
}: AddProductDialogProps) {
  const id = useId()
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'date_added' | 'date_modified'>>({
    name: '',
    category: '',
    price: 0,
    quantity: 0,
    expiration_date: null,
    image_url: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Upload new image if selected
    let imageUrl = formData.image_url
    if (selectedFile) {
      const formData = new FormData()
      formData.append('image', selectedFile)
      try {
        const response = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        })
        const data = await response.json()
        imageUrl = data.imageUrl
      } catch (error) {
        console.error('Image upload failed:', error)
        return
      }
    }

    const newProduct = {
      ...formData,
      image_url: imageUrl,
      expiration_date: formData.expiration_date || null,
      price: Number(formData.price),
      quantity: Number(formData.quantity)
    }
    
    onSave(newProduct)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Add New Product
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto">
          <ProductImage 
            imageUrl={formData.image_url} 
            onFileSelect={setSelectedFile}
            onImageChange={(url) => setFormData({...formData, image_url: url})}
          />
          
          <div className="px-6 pt-4 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-name`}>Product Name</Label>
                <Input
                  id={`${id}-name`}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-category`}>Category</Label>
                <Input
                  id={`${id}-category`}
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${id}-price`}>Price</Label>
                  <Input
                    id={`${id}-price`}
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-quantity`}>Quantity</Label>
                  <Input
                    id={`${id}-quantity`}
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-expiration`}>Expiration Date</Label>
                <Input
                  id={`${id}-expiration`}
                  type="date"
                  value={formData.expiration_date || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    expiration_date: e.target.value || null
                  })}
                />
              </div>

              <DialogFooter className="border-t px-0 pb-0 pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Create Product</Button>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Reuse the ProductImage component from EditProductDialog
function ProductImage({ 
  imageUrl, 
  onImageChange,
  onFileSelect
}: { 
  imageUrl: string
  onImageChange: (url: string) => void 
  onFileSelect: (file: File | null) => void
}) {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] = useFileUpload({
    accept: "image/*",
    initialFiles: []
  })
  
  const currentImage = (files[0] as { url?: string })?.url || imageUrl

  useEffect(() => {
    const f = files[0]?.file
    if (f instanceof File) {
      onFileSelect(f)
    }
  }, [files, onFileSelect])

  return (
    <div className="h-48">
      <div className="bg-muted relative flex size-full items-center justify-center overflow-hidden">
        {currentImage && (
          <img
            className="size-full object-cover"
            src={currentImage}
            alt="Product preview"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          <button
            type="button"
            className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
            onClick={openFileDialog}
          >
            <ImagePlusIcon size={16} aria-hidden="true" />
          </button>
          {currentImage && (
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={() => {
                removeFile(files[0]?.id)
                onImageChange('')
                onFileSelect(null)
              }}
            >
              <XIcon size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <input
        {...getInputProps()}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            const url = URL.createObjectURL(file)
            onImageChange(url)
          } else {
            onFileSelect(null)
          }
        }}
        className="sr-only"
      />
    </div>
  )
}
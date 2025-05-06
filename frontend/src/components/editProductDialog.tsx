import { useEffect, useId, useState } from "react"
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

interface EditProductDialogProps {
  product: Product
  onSave: (updatedProduct: Product) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditProductDialog({
  product,
  onSave,
  open,
  onOpenChange
}: EditProductDialogProps) {
  const id = useId()
  const [formData, setFormData] = useState<Product>(product)

  // Reset form data when dialog opens or product changes
  useEffect(() => {
    if (open) {
      setFormData(product)
    }
  }, [product, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedProduct = {
      ...formData,
      expiration_date: formData.expiration_date || null
    }
    onSave(updatedProduct)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Edit Product
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto">
          <ProductImage
            key={formData.image_url} // force re-render if URL changes
            imageUrl={formData.image_url}
            onImageChange={(url) =>
              setFormData({ ...formData, image_url: url })
            }
          />

          <div className="px-6 pt-4 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-name`}>Product Name</Label>
                <Input
                  id={`${id}-name`}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-category`}>Category</Label>
                <Input
                  id={`${id}-category`}
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value)
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-quantity`}>Quantity</Label>
                  <Input
                    id={`${id}-quantity`}
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseInt(e.target.value)
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-expiration`}>Expiration Date</Label>
                <Input
                  id={`${id}-expiration`}
                  type="date"
                  value={formData.expiration_date || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expiration_date: e.target.value || null
                    })
                  }
                />
              </div>

              <DialogFooter className="border-t px-0 pb-0 pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ProductImage({ imageUrl, onImageChange }: { 
    imageUrl: string
    onImageChange: (url: string) => void 
  }) {
    const [{ files }, { removeFile, openFileDialog, getInputProps }] = useFileUpload({
      accept: "image/*",
      initialFiles: imageUrl
        ? [{
            name: "product-image",
            size: 0,
            type: "image/*",
            url: imageUrl,
            id: "product-image"
          }]
        : []
    })
  
    const currentImage = files[0] && 'url' in files[0]
      ? (files[0] as { url: string }).url
      : imageUrl
  
    // Sync prop changes to internal file state (if needed)
    useEffect(() => {
      if (
        imageUrl && 
        !files.some((f) => 'url' in f && (f as { url: string }).url === imageUrl)
      ) {
        onImageChange(imageUrl)
      }
    }, [imageUrl, files, onImageChange])
  
    return (
      <div className="h-48">
        <div className="bg-muted relative flex size-full items-center justify-center overflow-hidden">
          {currentImage && (
            <img
              className="size-full object-cover"
              src={currentImage}
              alt="Product image"
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
            }
          }}
          className="sr-only"
        />
      </div>
    )
  }
  
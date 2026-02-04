import { useState, useRef } from 'react';
import { Image, Upload, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ImageUploadProps {
  onImageSelect: (file: File | null, preview: string | null) => void;
  className?: string;
}

export const ImageUpload = ({ onImageSelect, className }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setIsLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreview(result);
        onImageSelect(file, result);
        setIsLoading(false);
      };
      reader.onerror = () => {
        toast.error('Failed to read image');
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to load image');
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageSelect(null, null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cn('relative', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {preview ? (
        <div className="relative group">
          <div className="w-full h-32 rounded-xl overflow-hidden neu-pressed">
            <img 
              src={preview} 
              alt="Uploaded preview" 
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleClick}
          disabled={isLoading}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl neu-flat hover:scale-[1.01] transition-all text-muted-foreground hover:text-foreground"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Image className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">
            {isLoading ? 'Loading...' : 'Attach Image'}
          </span>
          <Upload className="w-4 h-4 ml-auto" />
        </button>
      )}
    </div>
  );
};

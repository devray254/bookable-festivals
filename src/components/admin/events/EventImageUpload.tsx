
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { validateImage, uploadEventImage } from "@/utils/image-upload";

interface EventImageUploadProps {
  form: any;
}

export function EventImageUpload({ form }: EventImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const validation = validateImage(file);
    if (!validation.valid) {
      toast({
        title: "Invalid image",
        description: validation.message,
        variant: "destructive"
      });
      return;
    }
    
    setSelectedImage(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Start upload process
    setIsUploading(true);
    
    try {
      // In a real app, this would upload the file to the server
      // For now, we'll just simulate it
      const imagePath = await uploadEventImage(file);
      
      // Set the image path in the form
      form.setValue("image", imagePath);
      
      toast({
        title: "Image uploaded",
        description: "Image has been uploaded successfully",
      });
    } catch (error) {
      console.error("Image upload failed:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FormField
      control={form.control}
      name="image"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Event Image</FormLabel>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Input
                type="file"
                id="event-image"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isUploading}
              />
              <Label 
                htmlFor="event-image" 
                className={`flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isUploading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    {selectedImage ? "Change Image" : "Upload Image"}
                  </>
                )}
              </Label>
              <Input 
                {...field} 
                className="hidden" 
                readOnly
              />
            </div>
            
            {/* Image preview */}
            {imagePreview && (
              <div className="mt-2 relative w-full aspect-video rounded-md overflow-hidden border">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                />
                <Button 
                  type="button"
                  variant="destructive" 
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                    form.setValue("image", "");
                  }}
                  disabled={isUploading}
                >
                  Remove
                </Button>
              </div>
            )}
            
            {!imagePreview && (
              <div className="flex items-center justify-center w-full p-6 border border-dashed rounded-md">
                <div className="flex flex-col items-center text-sm text-muted-foreground">
                  <Image className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p>Upload an image for your event</p>
                  <p className="text-xs">PNG, JPG or GIF up to 5MB</p>
                </div>
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

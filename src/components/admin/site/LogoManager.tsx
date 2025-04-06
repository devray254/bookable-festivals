
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Image as ImageIcon } from "lucide-react";
import { uploadLogo, validateLogo, getCurrentLogo } from "@/utils/image-upload";
import { useToast } from "@/hooks/use-toast";

export const LogoManager = () => {
  const [logoUrl, setLogoUrl] = useState<string>(getCurrentLogo());
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate the file
    const validation = validateLogo(file);
    if (!validation.valid) {
      toast({
        title: "Invalid logo file",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a logo file to upload",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const uploadedLogoUrl = await uploadLogo(file);
      setLogoUrl(uploadedLogoUrl);
      setPreviewUrl(null);
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      toast({
        title: "Logo uploaded successfully",
        description: "The new logo has been set and will be displayed on the site",
        variant: "default",
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your logo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Logo</CardTitle>
        <CardDescription>
          Upload your organization logo to be displayed in the header and footer.
          For best results, use a PNG or SVG with a transparent background.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-center p-6 bg-gray-50 rounded-md border border-gray-200">
            {previewUrl ? (
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-500 mb-2">Preview:</p>
                <img 
                  src={previewUrl}
                  alt="Logo Preview" 
                  className="max-h-20 object-contain"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-500 mb-2">Current Logo:</p>
                <img 
                  src={logoUrl}
                  alt="Current Logo" 
                  className="max-h-20 object-contain"
                />
              </div>
            )}
          </div>
          
          <div className="grid gap-2">
            <Input 
              ref={fileInputRef}
              type="file" 
              onChange={handleFileChange}
              accept=".png,.svg"
              className="hidden"
            />
            <Button 
              type="button" 
              onClick={triggerFileInput}
              variant="outline"
              className="w-full"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Select Logo File
            </Button>
          </div>
          
          <Alert>
            <AlertDescription>
              Recommended dimensions: 200×60 pixels. Maximum file size: 2MB.
              Only PNG and SVG formats are supported.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleUpload} 
          disabled={isUploading || !previewUrl} 
          className="w-full"
        >
          {isUploading ? (
            <>Uploading...</>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Logo
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LogoManager;

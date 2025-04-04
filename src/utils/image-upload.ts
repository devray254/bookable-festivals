
/**
 * Image upload utility functions
 */

// Upload image to the server
export const uploadEventImage = async (file: File): Promise<string> => {
  // In a real implementation, you would upload to a PHP endpoint
  // For demo purposes, we simulate a successful upload
  
  try {
    // Create form data for file upload
    const formData = new FormData();
    formData.append('image', file);
    
    console.log('Uploading image:', file.name);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return a dummy URL (in a real app, the server would return the actual URL)
    return `/uploads/${Date.now()}-${file.name}`;
    
    /* 
    // Real implementation would look like this:
    const response = await fetch('/api/upload-image.php', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload image');
    }
    
    const data = await response.json();
    return data.imageUrl;
    */
    
  } catch (error) {
    console.error('Image upload failed:', error);
    throw error;
  }
};

// Validate image before upload
export const validateImage = (file: File): { valid: boolean; message?: string } => {
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { 
      valid: false, 
      message: 'Image must be less than 5MB' 
    };
  }
  
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return { 
      valid: false, 
      message: 'Only JPG, PNG, GIF and WEBP images are allowed' 
    };
  }
  
  return { valid: true };
};

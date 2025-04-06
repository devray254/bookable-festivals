
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
    
    // Create a valid filename (remove spaces and special characters)
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const timestamp = Date.now();
    const imageFileName = `${timestamp}-${safeFileName}`;
    
    // In a real app, this would be an actual API call
    // For demo, return a path to the public/uploads directory
    // Return a dummy URL (in a real app, the server would return the actual URL)
    return `/uploads/${imageFileName}`;
    
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

// Upload logo to the server
export const uploadLogo = async (file: File): Promise<string> => {
  try {
    // Create form data for file upload
    const formData = new FormData();
    formData.append('logo', file);
    
    console.log('Uploading logo:', file.name);
    
    // Create a valid filename
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const logoFileName = `logo-${safeFileName}`;
    
    // For demo, store in localStorage for persistence
    // In a real app, this would be stored in a database
    localStorage.setItem('siteLogoPath', `/uploads/${logoFileName}`);
    
    return `/uploads/${logoFileName}`;
    
  } catch (error) {
    console.error('Logo upload failed:', error);
    throw error;
  }
};

// Get the current logo URL
export const getCurrentLogo = (): string => {
  return localStorage.getItem('siteLogoPath') || '/logo.png';
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

// Validate logo image (more restrictive than regular images)
export const validateLogo = (file: File): { valid: boolean; message?: string } => {
  // Check file size (max 2MB for logos)
  if (file.size > 2 * 1024 * 1024) {
    return { 
      valid: false, 
      message: 'Logo must be less than 2MB' 
    };
  }
  
  // Check file type (only PNG and SVG for logos)
  const validTypes = ['image/png', 'image/svg+xml'];
  if (!validTypes.includes(file.type)) {
    return { 
      valid: false, 
      message: 'Only PNG and SVG formats are allowed for logos' 
    };
  }
  
  return { valid: true };
};

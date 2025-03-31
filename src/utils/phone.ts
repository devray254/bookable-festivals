
// Phone number validation and formatting utilities

/**
 * Validates if the provided string is a valid Kenyan phone number
 */
export const validatePhoneNumber = (phone: string): boolean => {
  // Basic Kenyan phone number validation (Safaricom)
  const regex = /^(?:(?:\+|)254|0)?7[0-9]{8}$/;
  return regex.test(phone);
};

/**
 * Formats a phone number to the standard format required by M-Pesa
 */
export const formatPhoneNumber = (phone: string): string => {
  let formatted = phone;
  
  // Strip any non-digit characters
  formatted = formatted.replace(/\D/g, '');
  
  // If it's a 9-digit number starting with 7, prefix with 254
  if (/^7\d{8}$/.test(formatted)) {
    formatted = `254${formatted}`;
  }
  
  // If it's a 10-digit number starting with 07, convert to 2547...
  if (/^07\d{8}$/.test(formatted)) {
    formatted = `254${formatted.substring(1)}`;
  }
  
  return formatted;
};

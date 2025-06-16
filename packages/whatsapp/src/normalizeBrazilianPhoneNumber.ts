/**
 * Normalizes Brazilian phone numbers to handle the 8/9 digit mobile number issue
 * 
 * Brazilian mobile numbers can have either 8 or 9 digits after the area code:
 * - Old format: 55 47 97081843 (8 digits)
 * - New format: 55 47 997081843 (9 digits with extra 9)
 * 
 * This function normalizes both formats to the 9-digit format to ensure consistency
 * and prevent session mismatches in WhatsApp integration.
 * 
 * @param phoneNumber - The phone number to normalize (e.g., "5547997081843" or "554797081843")
 * @returns The normalized phone number in 9-digit format
 */
export const normalizeBrazilianPhoneNumber = (phoneNumber: string): string => {
  // Remove any non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, "");
  
  // Check if it's a Brazilian number (starts with 55)
  if (!digitsOnly.startsWith("55")) {
    return digitsOnly;
  }
  
  // Brazilian numbers should be at least 12 digits (55 + 2-digit area code + 8-digit number)
  // or 13 digits (55 + 2-digit area code + 9-digit number)
  if (digitsOnly.length < 12 || digitsOnly.length > 13) {
    return digitsOnly;
  }
  
  // Extract parts: country code (55) + area code (2 digits) + number
  const countryCode = digitsOnly.slice(0, 2); // "55"
  const areaCode = digitsOnly.slice(2, 4); // e.g., "47"
  const phoneBody = digitsOnly.slice(4); // e.g., "97081843" or "997081843"
  
  // Check if it's a mobile number (starts with 9)
  // Mobile numbers in Brazil start with 9, landlines don't
  const isMobile = phoneBody.startsWith("9");
  
  if (isMobile) {
    // Already in 9-digit format
    if (phoneBody.length === 9) {
      return digitsOnly; // Already normalized
    }
    // Invalid mobile number length
    return digitsOnly;
  } else {
    // Check if it's an 8-digit mobile number that needs the extra 9
    if (phoneBody.length === 8) {
      // Check if the first digit suggests it could be a mobile number
      // Brazilian mobile numbers typically start with 9, 8, 7, or 6
      const firstDigit = phoneBody[0];
      if (["6", "7", "8", "9"].includes(firstDigit)) {
        // Add the extra 9 to normalize to 9-digit format
        return `${countryCode}${areaCode}9${phoneBody}`;
      }
    }
    
    // For landlines or other cases, return as-is
    return digitsOnly;
  }
};

/**
 * Checks if a phone number is a Brazilian mobile number
 * @param phoneNumber - The phone number to check
 * @returns true if it's a Brazilian mobile number
 */
export const isBrazilianMobileNumber = (phoneNumber: string): boolean => {
  const digitsOnly = phoneNumber.replace(/\D/g, "");
  
  // Must start with 55 (Brazil)
  if (!digitsOnly.startsWith("55")) {
    return false;
  }
  
  // Must be 12 or 13 digits total
  if (digitsOnly.length < 12 || digitsOnly.length > 13) {
    return false;
  }
  
  const phoneBody = digitsOnly.slice(4); // Remove country and area code
  
  // Mobile numbers start with 9 or are 8-digit numbers that could be mobile
  return phoneBody.startsWith("9") || 
         (phoneBody.length === 8 && ["6", "7", "8", "9"].includes(phoneBody[0]));
};

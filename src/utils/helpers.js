// Generate Login ID as per your requirement
export const generateLoginId = (companyName, employeeName, year = new Date().getFullYear()) => {
  // Format: LOT 00:01 fun lefttext all the employee's first and last name types of group
  // Example: 01202002020001
  
  // Extract company code (first 2 letters)
  const companyCode = companyName
    .substring(0, 2)
    .toUpperCase()
    .split('')
    .map(char => char.charCodeAt(0) - 64)
    .join('')
    .padStart(2, '0');
  
  // Extract employee name code
  const names = employeeName.split(' ');
  const firstName = names[0] || '';
  const lastName = names[names.length - 1] || '';
  
  const nameCode = (firstName.substring(0, 2) + lastName.substring(0, 2))
    .toUpperCase()
    .split('')
    .map(char => char.charCodeAt(0) - 64)
    .join('')
    .padStart(4, '0');
  
  // Generate serial number (for static data, we'll use random)
  const serial = Math.floor(Math.random() * 9999) + 1;
  const serialFormatted = serial.toString().padStart(4, '0');
  
  // Final format: CompanyCode + Year + NameCode + Serial
  return `${companyCode}${year}${nameCode}${serialFormatted}`;
};

// Generate random password
export const generateRandomPassword = (length = 12) => {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
/**
 * Extracts the icon type from an HTML notification message
 * @param message HTML message containing an icon
 * @returns The icon type (e.g., 'check-circle', 'exclamation-circle', etc.)
 */
export const extractIconType = (message: string): string => {
  // Default icon type
  let iconType = 'bell';
  
  // Check for Font Awesome icons
  const faIconMatch = message.match(/class="fa fa-([^"]+)"/);
  if (faIconMatch && faIconMatch[1]) {
    iconType = faIconMatch[1];
  }
  
  // Check for Lucide icons (if used in the future)
  const lucideIconMatch = message.match(/class="lucide lucide-([^"]+)"/);
  if (lucideIconMatch && lucideIconMatch[1]) {
    iconType = lucideIconMatch[1];
  }
  
  return iconType;
};

/**
 * Maps icon types to notification types
 * @param iconType The extracted icon type
 * @returns The corresponding notification type
 */
export const mapIconToNotificationType = (iconType: string): 'info' | 'warning' | 'error' | 'success' => {
  switch (iconType) {
    case 'check-circle':
      return 'success';
    case 'exclamation-circle':
    case 'exclamation-triangle':
      return 'warning';
    case 'times-circle':
    case 'ban':
      return 'error';
    case 'info-circle':
    default:
      return 'info';
  }
}; 
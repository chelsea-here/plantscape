/**
 * Parses an input string representing a dimension (length/depth)
 * and attempts to convert it into a decimal feet string.
 * Supports formats like "5", "5.5", "5'", "5'6", "5' 6\"", "5' 6", "5'-6"", and "5' - 6"".
 * It only processes whole inches, ignoring any fractional inch input.
 *
 * @param {string} inputValue - The raw string value from the input field.
 * @returns {string} The parsed dimension as a decimal string (e.g., "5.50"),
 * or the original inputValue if parsing fails for known formats.
 */
export const parseDimensionInput = (inputValue) => {
  if (!inputValue) return ""; // Return empty string for empty input

  // Trim whitespace and convert to lowercase for easier parsing
  const cleanedValue = inputValue.trim().toLowerCase();

  // Regex to match formats like "5'", "5'6", "5' 6\"", "5' 6", "5'-6"", and "5' - 6""
  // Group 1: feet (one or more digits)
  // Separator: zero or more spaces, followed by a single quote OR a hyphen, followed by zero or more spaces
  // Group 2: inches (optional, one or more digits, followed by optional double quote)
  const footInchRegex = /^(\d+)\s*['\-]\s*(?:(\d+)(?:")?)?$/; // MODIFIED: Added \s* around ['\-]

  // Regex to match decimal numbers like "5", "5.", ".5", "5.5"
  const decimalRegex = /^\d*\.?\d*$/;

  if (footInchRegex.test(cleanedValue)) {
    const match = cleanedValue.match(footInchRegex);
    const feet = parseFloat(match[1]);
    // If inches part exists (match[2]), parse it, otherwise it's 0
    const inches = match[2] ? parseFloat(match[2]) : 0;
    // Convert to decimal feet, fixed to 2 decimal places for consistency
    return (feet + inches / 12).toFixed(2);
  } else if (decimalRegex.test(cleanedValue)) {
    // If it's a valid decimal number string, return it as is.
    // We don't parseFloat here to keep it as a string for the input value,
    // actual parseFloat for submission happens in handleSubmit.
    return cleanedValue;
  }
  // If it doesn't match any recognized format, return the raw input.
  // This will then be caught by validation as NaN if it's not a number.
  return inputValue;
};

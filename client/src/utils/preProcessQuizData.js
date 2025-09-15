/**
 * Pre-processes the raw quiz data to prepare it for the scoring algorithm. (Based on completeness)
 * It fills in the image_tags array for images that represent a single style,
 * and throws an error if a multi-style image has no tags or if an image_tag
 * does not match any of its associated design style's tags.
 *
 * @param {Array} quizContent The raw quiz content array.
 * @param {Array} styles The array of style objects from the API.
 * @returns {Object} An object containing the processed quiz data and the total tag counts per style.
 * @throws {Error} If an item has multiple designStyleNames and no image_tags, or if an image_tag is invalid.
 */
export function preProcessQuizData(quizContent, styles) {
  const enhancedQuizItems = [];
  const styleTagCounts = {};

  // First, calculate the total number of unique tags for each style from the API data
  styles.forEach((style) => {
    styleTagCounts[style.design_style_name] = style.design_tags.length;
  });

  // Next, enhance the quiz content by filling in tags for single-style items and validating existing tags
  quizContent.forEach((item) => {
    const associatedStyles = item.designStyleNames
      .map((styleName) => styles.find((s) => s.design_style_name === styleName))
      .filter((s) => s); // Filter out any styles not found

    // Collect all valid tags for this item's associated styles
    const allValidTagsForStyles = new Set();
    associatedStyles.forEach((style) => {
      style.design_tags.forEach((tag) => allValidTagsForStyles.add(tag));
    });

    // Check if the item has a single design style and an empty image_tags array -- if so styleMatch by adding all the design style tags = 100% style completeness score
    if (item.designStyleNames.length === 1 && item.image_tags.length === 0) {
      const styleName = item.designStyleNames[0];
      const styleMatch = associatedStyles[0];

      if (styleMatch) {
        // Create a copy of the item and populate its image_tags with all the style's tags
        enhancedQuizItems.push({
          ...item,
          image_tags: [...styleMatch.design_tags],
        });
      } else {
        // Handle cases where the design style name in the quiz item doesn't match a style from the API
        console.warn(`Design style "${styleName}" not found in API data.`);
        enhancedQuizItems.push(item);
      }
    } else if (
      item.designStyleNames.length > 1 &&
      item.image_tags.length === 0
    ) {
      // If the item has multiple styles and no tags, throw an error
      throw new Error(
        `Item ID: "${item.id}" - multiple designStyleNames must have image_tags for scoring`
      );
    } else {
      // Validate the item's existing image_tags against its associated styles' tags
      item.image_tags.forEach((tag) => {
        if (!allValidTagsForStyles.has(tag)) {
          throw new Error(
            `Item ID: "${item.id}" - Mismatched tag found: "${tag}". This tag is not associated with any of the item's design styles.`
          );
        }
      });
      // If all checks pass, add the item as is
      enhancedQuizItems.push(item);
    }
  });

  return {
    enhancedQuizItems,
    styleTagCounts,
  };
}

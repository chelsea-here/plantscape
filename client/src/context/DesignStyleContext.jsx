import { createContext, useState, useEffect } from "react";
import axios from "axios"; // Import axios for API calls

export const DesignStyleContext = createContext();

// Helper function to process the comma-separated tag string from the API
const parseTagsString = (tagsString) => {
  return tagsString ? tagsString.split(",").map((tag) => tag.trim()) : [];
};

export const DesignStyleProvider = ({ children }) => {
  const [styles, setStyles] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(null); // user-selected style ID

  // Helper function to dynamically get tags for a style from the 'styles' state
  const getStyleTags = (styleId) => {
    const style = styles.find((s) => s.id === styleId);
    return style ? style.design_tags : [];
  };

  // Helper function to dynamically get id for a style from the 'styles' state
  const getStyleId = (styleName) => {
    const style = styles.find(
      (s) => s.design_style_name === styleName.toLowerCase()
    );
    return style ? style.id : null;
  };

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const { data } = await axios.get("/api/design");
        // Process the incoming data to parse the tags string into an array
        const processedStyles = data.map((style) => ({
          ...style,
          design_tags: parseTagsString(style.design_tags),
        }));
        setStyles(processedStyles);
        if (processedStyles.length > 0 && !selectedStyle) {
          setSelectedStyle(processedStyles[0].id); // Default to the ID of the first design style
        }
      } catch (err) {
        console.error("Failed to fetch design styles:", err);
      }
    };

    fetchStyles();
  }, [selectedStyle]);

  return (
    <DesignStyleContext.Provider
      value={{
        styles,
        selectedStyle,
        setSelectedStyle,
        getStyleTags,
        getStyleId,
      }}
    >
      {children}
    </DesignStyleContext.Provider>
  );
};

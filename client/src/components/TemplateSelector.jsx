import { useState, useEffect, useContext } from "react";
import { DesignStyleContext } from "../context/DesignStyleContext";
import "./TemplateSelector.css";

/**
 * Pre-processes garden bed template data to verify design style names
 * and add the corresponding style ID.
 *
 * @param {Array<Object>} gardenBedTemplates The raw garden bed template data.
 * @param {Array<Object>} styles The array of style objects from the API, used for validation.
 * @returns {Array<Object>} A new array of templates with the validated style ID.
 */
function preProcessGardenBedTemplates(gardenBedTemplates, styles) {
  const processedTemplates = gardenBedTemplates.map((template) => {
    const matchingStyle = styles.find(
      (s) => s.design_style_name === template.designStyleName
    );

    if (!matchingStyle) {
      console.warn(
        `Warning: Template with ID "${template.id}" has a designStyleName ("${template.designStyleName}") that does not match any available style. This template may not display correctly.`
      );
    }

    return {
      ...template,
      designStyleId: matchingStyle ? matchingStyle.id : null,
    };
  });
  return processedTemplates;
}

// TemplateSelector component: Displays available templates and allows selection
// Props:
// - templates: Array of template objects (from GardenBedContext.templateBeds)
// - onSelectTemplate: Callback function (template) => void, called when a template is selected
// - selectedTemplateId: The ID of the currently selected template (for highlighting)

export function TemplateSelector({
  templates,
  onSelectTemplate,
  selectedTemplateId,
}) {
  const { styles } = useContext(DesignStyleContext);
  const [processedTemplates, setProcessedTemplates] = useState([]);

  useEffect(() => {
    if (templates && templates.length > 0 && styles.length > 0) {
      const enhancedTemplates = preProcessGardenBedTemplates(templates, styles);
      setProcessedTemplates(enhancedTemplates);
    }
  }, [templates, styles]);

  if (!processedTemplates || processedTemplates.length === 0) {
    return <p>No templates available.</p>;
  }

  return (
    <div className="template-selector-grid">
      {processedTemplates.map((template) => (
        <div
          key={template.id}
          onClick={() => onSelectTemplate(template)}
          className={`template-card ${
            selectedTemplateId === template.id ? "selected" : ""
          }`}
        >
          <h3>{template.name}</h3>
          {/* <p>
            Size: {template.bedLength}ft x {template.bedDepth}ft
          </p> */}
          <p>Design Style: {template.designStyleName}</p>
          {/* You can add a small image preview here if your templates have image_url */}
          {template.image_url && (
            <img src={template.image_url} alt={template.name} />
          )}
        </div>
      ))}
    </div>
  );
}

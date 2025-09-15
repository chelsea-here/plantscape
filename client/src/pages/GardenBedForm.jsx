import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { GardenBedContext } from "../context/GardenBedContext";
import { TemplateSelector } from "../components/TemplateSelector";
import { ProjectContext } from "../context/ProjectContext";
import { UserContext } from "../context/UserContext";
import { DesignStyleContext } from "../context/DesignStyleContext";
import { parseDimensionInput } from "../utils/dimensionParser";
import "./GardenBedForm.css";

export default function GardenBedForm() {
  const navigate = useNavigate();
  const { projectId: projectIdFromUrl } = useParams();

  //Contexts//
  const { templateBeds, createGardenBed, fetchGardenBedsForProject } =
    useContext(GardenBedContext); // need a helper function to extract design_type from each template.
  const { userId, getHeaders } = useContext(UserContext);
  const { currentEditingProject, fetchProject } = useContext(ProjectContext);
  const { styles: designStyles } = useContext(DesignStyleContext); // unnecessary rename?

  //Local States//
  const [bedName, setBedName] = useState("");
  const [bedWidth, setBedWidth] = useState(null);
  const [bedDepth, setBedDepth] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedDesignStyleId, setSelectedDesignStyleId] = useState("");
  const [startMode, setStartMode] = useState("template"); // 'template' or 'custom'

  //Common local states for form handling//
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // --- useEffect to fetch current project if not already loaded ---
  useEffect(() => {
    if (projectIdFromUrl && !currentEditingProject?.id && userId) {
      fetchProject(projectIdFromUrl);
    }
  }, [projectIdFromUrl, currentEditingProject, userId, fetchProject]);

  // --- Handle Template Selection ---
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    const { bedWidth, bedDepth } = template.bedSize;
    setBedWidth(bedWidth);
    setBedDepth(bedDepth);
    setBedName(template.name);
  };

  // --- onChange handler for dimension inputs ---
  const handleDimensionChange = (e, setter) => {
    const rawValue = e.target.value;
    setter(rawValue);
  };

  // --- Input Validation Helper ---
  const validateInputs = () => {
    if (!bedName.trim()) {
      return "Garden Bed Name cannot be empty.";
    }
    if (!userId) {
      return "User not authenticated. Please log in.";
    }

    if (startMode === "custom") {
      // Parse the dimensions here for validation
      const parsedWidth = parseFloat(parseDimensionInput(bedWidth)); // Changed to parsedWidth
      const parsedDepth = parseFloat(parseDimensionInput(bedDepth));
      console.log("Parsed Width Custom:", parsedWidth);
      console.log("Parsed Depth Custom:", parsedDepth);

      if (isNaN(parsedWidth) || parsedWidth <= 0) {
        return "Bed Width must be a positive number (e.g., 5.5 or 5'6)."; // Updated message
      }
      if (isNaN(parsedDepth) || parsedDepth <= 0) {
        return "Bed Depth must be a positive number (e.g., 3.25 or 3'3).";
      }
      if (!selectedDesignStyleId) {
        return "Please select a design style for your custom bed.";
      }
    } else if (startMode === "template") {
      if (!selectedTemplate) {
        return "Please select a template.";
      }
      // Added validation for template's designStyleId, as it's required by the backend
      if (!selectedTemplate.designStyleId) {
        return "Selected template is missing a design style. Please choose another template or contact support.";
      }
    }
    return null; // No errors
  };

  // --- Form Submission Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    //run the input validation helper function, validateInputs and set error state for any errors that pop up
    const validationError = validateInputs();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setSubmitting(true);
    setSubmitError(null); // Clear previous errors
    setSubmitSuccess(false); // Reset success state

    const projectId = currentEditingProject?.id;

    if (!projectId) {
      setSubmitError(
        "No active project selected. Please select a project first."
      );
      setSubmitting(false);
      return;
    }

    try {
      let bedData = {
        layout_name: bedName.trim(),
        projects_id: projectId,
      };

      //instead of setting all the various bedData at once, we are separating it into two start modes: template based, or custom
      if (startMode === "template") {
        bedData = {
          ...bedData,
          bed_length: parseFloat(selectedTemplate.bedSize.bedWidth),
          bed_depth: parseFloat(selectedTemplate.bedSize.bedDepth),
          design_type: selectedTemplate.designStyleId,
          placed_plants_data: selectedTemplate.placedPlants,
        };
      } else {
        bedData = {
          ...bedData,
          bed_length: parseFloat(parseDimensionInput(bedWidth)),
          bed_depth: parseFloat(parseDimensionInput(bedDepth)),
          design_type: selectedDesignStyleId, // <--- Added for custom mode
          placed_plants_data: [], // <--- Added for custom mode (empty array)
        };
      }
      // Debug log to see the payload being sent
      console.log("Sending bedData to API:", bedData);

      const response = await axios.post(
        `/api/layouts/${projectId}/layouts`,
        bedData,
        getHeaders()
      );

      setSubmitSuccess(true);
      if (fetchGardenBedsForProject) {
        await fetchGardenBedsForProject();
      }

      navigate(`/mygardenbed/${response.data.id}`);
    } catch (err) {
      console.error(
        "Error creating garden bed layout:",
        err.response ? err.response.data : err.message
      );
      setSubmitError(
        err.response?.data?.error ||
          "Failed to create garden bed layout. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h1>Create a New Garden Bed:</h1>
      {!currentEditingProject && projectIdFromUrl ? (
        <p>Loading project details...</p>
      ) : !currentEditingProject && !projectIdFromUrl ? (
        <p>Please select a project first (e.g., from "My Projects").</p>
      ) : (
        <p>
          For Project: <span>{currentEditingProject.project_name}</span>
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="bedName">Garden Bed Name:</label>
          <input
            type="text"
            id="bedName"
            value={bedName}
            onChange={(e) => setBedName(e.target.value)}
            placeholder="North Bed along Fence, Part-Shade"
            style={{ color: bedName ? "inherit" : "#999" }}
            required
            disabled={submitting}
          />
        </div>
        <div>
          <h2>
            Would you like to start with a template ...or do you prefer a blank
            slate?
          </h2>
          <div className="mode-toggle-buttons">
            <button
              type="button"
              onClick={() => setStartMode("template")}
              disabled={submitting}
              className={startMode === "template" ? "active" : ""}
            >
              Template
            </button>
            <button
              type="button"
              onClick={() => setStartMode("custom")}
              disabled={submitting}
              className={startMode === "custom" ? "active" : ""}
            >
              Custom
            </button>
          </div>
          {startMode === "template" && (
            <div className="template-section">
              <h3>Select a Template:</h3>
              <TemplateSelector
                templates={templateBeds}
                onSelectTemplate={handleTemplateSelect}
                selectedTemplateId={selectedTemplate?.id}
              />
              {selectedTemplate && (
                <p>
                  Selected Template: <span>{selectedTemplate.name}</span> (
                  {selectedTemplate.bedSize.bedWidth}x
                  {selectedTemplate.bedSize.bedDepth}ft, Design:{" "}
                  {selectedTemplate.designStyleName})
                </p>
              )}
            </div>
          )}

          {startMode === "custom" && (
            <div className="custom-section">
              <h3>Define Custom Dimensions:</h3>
              <div>
                <label htmlFor="designStyle">
                  Select Design Style:<span> (Optional)</span>
                </label>
                <select
                  id="designStyle"
                  value={selectedDesignStyleId}
                  onChange={(e) => setSelectedDesignStyleId(e.target.value)}
                  required={startMode === "custom"}
                  disabled={submitting}
                >
                  <option value="">-- Select a Style --</option>
                  {designStyles.map((style) => (
                    <option key={style.id} value={style.id}>
                      {style.design_style_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="bedWidth">Garden Bed Width (ft):</label>
                <input
                  type="text"
                  id="bedWidth"
                  value={bedWidth}
                  onChange={(e) => handleDimensionChange(e, setBedWidth)}
                  placeholder="e.g., 5.5 or 5'6"
                  required={startMode === "custom"}
                  disabled={submitting}
                />
                <p className="dimension-helper-text">
                  Enter as decimal feet (e.g., 5.5) or feet and inches (e.g.,
                  5'6" or 5' 6).
                </p>
              </div>
              <div>
                <label htmlFor="bedDepth">Garden Bed Depth (ft):</label>
                <input
                  type="text"
                  id="bedDepth"
                  value={bedDepth}
                  onChange={(e) => handleDimensionChange(e, setBedDepth)}
                  placeholder="e.g., 3.25 or 3'3"
                  required={startMode === "custom"}
                  disabled={submitting}
                />
                <p className="dimension-helper-text">
                  Enter as decimal feet (e.g., 3.25) or feet and inches (e.g.,
                  3'3" or 3' 3).
                </p>
              </div>
            </div>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={submitting || !currentEditingProject?.id}
          >
            {submitting ? "Creating..." : "Create Garden Bed"}
          </button>
        </div>

        {submitSuccess && (
          <p className="success-message">Garden Bed created successfully!</p>
        )}

        {submitError && <p className="error-message">{submitError}</p>}
      </form>
    </div>
  );
}

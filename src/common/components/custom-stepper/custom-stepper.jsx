import React, { useState } from "react";
import PropTypes from "prop-types";
import CheckIcon from "@mui/icons-material/Check";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import useCustomStepper from "./use-custom-stepper";
import CustomButton from "../custom-button/custom-button.component";
import {
  ArrowBack,
  ArrowForward,
  ChevronLeftOutlined,
  SaveAlt,
  SaveAltTwoTone,
  SaveAs,
  SaveOutlined,
  SaveRounded,
} from "@mui/icons-material";

/**
 * CustomStepper - A flexible and reusable stepper component
 *
 * @param {Object} props Component props
 * @param {Array} props.steps Array of step objects with { label, optional description }
 * @param {number} props.activeStep Current active step index (zero-based)
 * @param {boolean} props.allowClickOnCompleted Allow clicking on completed steps to navigate back
 * @param {function} props.setActiveStep Callback function to change the active step
 * @param {function} props.onStepClick Callback function when step is clicked - receives step index
 * @param {string} props.orientation 'horizontal' or 'vertical'
 * @param {Object} props.colors Custom color scheme
 * @param {boolean} props.showLabels Whether to show step labels
 * @param {React.ReactNode} props.completedIcon Custom icon for completed steps
 * @returns {React.ReactNode} The stepper component
 */
const CustomStepper = ({
  steps = [],
  activeStep = 0,
  setActiveStep = () => {},
  showPreview,
  setShowPreview,
  allowClickOnCompleted = true,
  onStepClick = () => {},
  orientation = "horizontal",
  colors = {},
  showLabels = true,
  children,
}) => {
  const { nextStep, prevStep, editCampaign } = useCustomStepper({
    steps,
    activeStep,
    setActiveStep,
    showPreview,
    setShowPreview,
  });
  // Merge default colors with custom colors
  const defaultColors = {
    active: "#3b82f6", // blue-500
    completed: "#3b82f6", // blue-500
    incomplete: "#9ca3af", // gray-400
    text: {
      active: "#1e40af", // blue-800
      completed: "#3b82f6", // blue-500
      incomplete: "#6b7280", // gray-500
    },
    progress: "#3b82f6", // blue-500
    background: "#f9fafb", // gray-50
  };

  const mergedColors = { ...defaultColors, ...colors };

  // Size configurations
  const sizeConfig = {
    small: {
      circle: "w-6 h-6",
      font: "text-xs",
      icon: "h-3 w-3",
      padding: "p-3",
      line: "h-0.5",
    },
    medium: {
      circle: "w-10 h-10",
      font: "text-sm",
      icon: "h-5 w-5",
      padding: "p-5",
      line: "h-0.5",
    },
    large: {
      circle: "w-14 h-14",
      font: "text-base",
      icon: "h-6 w-6",
      padding: "p-6",
      line: "h-1",
    },
  };

  // Handle click on a step
  const handleStepClick = (index) => {
    if (index < activeStep || index === activeStep) {
      onStepClick(index);
    }
  };

  // Calculate progress percentage
  const progressPercentage = (activeStep / (steps.length - 1)) * 100;

  // Render horizontal stepper
  const renderHorizontalStepper = () => (
    <div className="p-3 bg-blue-50 border border-solid border-gray-50 rounded-lg">
      <div className="relative flex justify-between items-center">
        {/* Connecting Line - Background */}
        <div className="absolute top-[14px] left-0 w-full h-0.5 bg-primary z-0" />

        {steps.map((step, index) => (
          <div
            key={index}
            className="relative z-10 flex flex-col items-center w-full"
            onClick={() => allowClickOnCompleted && handleStepClick(index)}
          >
            {/* Step Circle */}
            <div
              className={`z-10 w-7 h-7 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                index < activeStep
                  ? "bg-blue-600 border-blue-600 text-white"
                  : index === activeStep
                    ? "bg-white border-blue-600 text-blue-600"
                    : "bg-white border-gray-300 text-gray-400"
              }`}
            >
              {index < activeStep ? <CheckIcon className="h-4 w-4" /> : index + 1}
            </div>

            {/* Label */}
            {showLabels && (
              <span
                className={`mt-2 text-xs text-center px-2 font-medium w-full max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap ${
                  index < activeStep
                    ? "text-blue-600"
                    : index === activeStep
                      ? "text-blue-600 font-semibold"
                      : "text-gray-400"
                }`}
              >
                {step}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Render vertical stepper
  const renderVerticalStepper = () => (
    <div className="p-3 bg-gray-50 border rounded-lg">
      <div className="relative flex flex-col space-y-10">
        {/* Connecting Line - Background */}
        <div className="absolute top-0 bottom-0 left-5 w-0.5 bg-gray-200 z-0" />

        {steps.map((step, index) => (
          <div
            key={index}
            className="relative z-10 flex items-start"
            onClick={() => allowClickOnCompleted && handleStepClick(index)}
          >
            {/* Step Circle */}
            <div
              className={`relative z-10 w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                index < activeStep
                  ? "bg-blue-600 border-blue-600 text-white"
                  : index === activeStep
                    ? "bg-white border-blue-600 text-blue-600"
                    : "bg-white border-gray-300 text-gray-400"
              }`}
            >
              {index < activeStep ? <CheckIcon className="h-4 w-4" /> : index + 1}
            </div>

            {/* Label and Description */}
            {showLabels && (
              <div className="ml-4">
                <span
                  className={`text-sm font-medium block ${
                    index < activeStep
                      ? "text-blue-600"
                      : index === activeStep
                        ? "text-blue-600 font-semibold"
                        : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-1 max-w-[250px]">{step}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {orientation === "vertical" ? renderVerticalStepper() : renderHorizontalStepper()}

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">{children}</div>

      {/* Sticky navigation at bottom */}
      <div className="sticky bottom-0 bg-white p-4 border-t flex justify-between mt-auto shadow-lg">
        <CustomButton
          text="Previous"
          onClick={prevStep}
          disabled={activeStep === 0}
          className="flex items-center py-2 px-4 rounded-md btn-outline"
          startIcon={<ArrowBack className="h-4 w-4 mr-1" />}
        />

        <CustomButton
          text={activeStep < steps.length - 1 ? "Next" : "Save"}
          onClick={activeStep < steps.length - 1 ? nextStep : editCampaign}
          className="btn-primary"
          endIcon={activeStep < steps.length - 1 ? <ArrowForward className="h-4 w-4 ml-1" /> : null}
        />
      </div>
    </div>
  );
};

CustomStepper.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
  activeStep: PropTypes.number,
  allowClickOnCompleted: PropTypes.bool,
  onStepClick: PropTypes.func,
  orientation: PropTypes.oneOf(["horizontal", "vertical"]),
  colors: PropTypes.object,
  showLabels: PropTypes.bool,
  completedIcon: PropTypes.node,
};

export default CustomStepper;

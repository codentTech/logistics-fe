function useCustomStepper({
  steps,
  activeStep,
  setActiveStep,
  showPreview,
  setShowPreview,
}) {
  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
      setShowPreview(false);
    } else {
      setShowPreview(true);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      setShowPreview(false);
    }
  };

  const editCampaign = () => {
    // setActiveStep(0);
    // setShowPreview(false);
  };
  return { showPreview, setShowPreview, nextStep, prevStep, editCampaign };
}

export default useCustomStepper;

const removePercentageSign = (value) => {
  const tax =
    value && String(value).includes('%') ? Number(value.split('%')[0]) : Number(value);

  return tax;
};

export default removePercentageSign;

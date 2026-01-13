const currentYear = () => {
  const today = new Date();
  const date = new Date(today);
  const year = date.getFullYear();

  return year;
};

export default currentYear;

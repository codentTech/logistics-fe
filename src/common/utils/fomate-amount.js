const formatAmount = (value) => {
  const amount = Number(value);
  if (typeof amount !== 'number') {
    console.error('Invalid Amount');
  }

  // Format the number with commas and two decimal places
  const formattedAmount = new Intl.NumberFormat('en-US', {
    currency: 'EUR', // You can adjust the currency as needed
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);

  return `${formattedAmount} €` || 0;
};

export default formatAmount;

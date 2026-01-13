export const customersOptionsData = (customers) => {
  const options = (customers || []).map((contact) => {
    let label = '';

    if (contact.companyName) {
      label += contact.companyName;
    }

    if (contact.firstName || contact.lastName) {
      if (label) {
        label += ' ';
      }

      label += `(${contact.firstName || ''} ${contact.lastName || ''})`;
    }

    return {
      value: contact.id,
      label
    };
  });

  return options;
};

export const companyAddressOptionsData = (customer) => {
  const options = [].concat(
    ((customer && customer?.companyAddress) || []).map((address) => {
      // Create an array of the address parts that are not empty
      const addressParts = [
        address.address || '',
        address.addressSupplement || '',
        address.postalCode || ''
      ];

      // Filter out empty parts and join them with a comma
      const label = addressParts.filter((part) => part !== '').join(', ');

      return {
        value: address.id,
        label
      };
    })
  );

  return options;
};

export const contactPersonOptionsData = (customer) => {
  const options = (customer?.additionalContact || [])
    .map((contact) => {
      if (contact.firstName || contact.lastName) {
        const truncatedAddress =
          contact.address && contact.address.length > 20
            ? `${contact.address.substring(0, 20)}...`
            : contact.address;

        return {
          id: contact.id,
          value: contact.id,
          label: `${contact.firstName} ${contact.lastName} ${truncatedAddress || ''}`
        };
      }
      return null;
    })
    .filter((option) => option !== null);

  return options;
};

export const contactPersonOptionsName = (customer, value) => {
  const options = (customer?.additionalContact || [])?.filter(
    (option) => value === option.id
  )[0];

  return options;
};

export const customerAddressName = (customer, value) => {
  const options = (customer?.companyAddress || [])?.filter(
    (option) => value === option.id
  )[0];

  return options;
};

export const addressLabelOptionsData = (customer) => {
  const options = customer?.companyAddress?.map((label) => ({
    id: label.id,
    value: label.id,
    label: label.addressLabel
  }));

  return options;
};

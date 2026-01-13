import { enqueueSnackbar } from "notistack";
import DOCUMENT from "@/common/constants/document.constants";
import capitalizeFirstLetter from "../capitalize-first-letter";
import { DOCUMENT_STATUS } from "@/common/constants/document-status.constant";

// Constants for predefined colors and file extensions
export const COLORS = ["red", "blue", "green"];
export const ONLY_IMAGES = ["jpeg", "jpg", "png"];
export const ONLY_IMAGES_PDF = ["jpeg", "jpg", "png", "pdf"];

// Function to generate a document URL based on parameters
export const DOCUMENT_URL = ({ id, displayId, convertedFrom }) => {
  if (convertedFrom) {
    // If converted from another document
    return `${window.location.pathname}?from=${convertedFrom}&id=${id}&${
      displayId ? `&d-id=${displayId}` : ""
    }`;
  } else {
    // If not converted from another document
    return `${window.location.pathname}?id=${id}${displayId ? `&d-id=${displayId}` : ""}`;
  }
};

// Function to generate a document identifier based on parameters
export const DOCUMENT_IDENTIFIER = ({ id, displayId }) => {
  if (displayId === "null") {
    return id;
  } else {
    return displayId || id;
  }
};

// Function to generate a document view details URL based on parameters
export const DOCUMENT_VIEW_DETAILS_URL = ({ id, displayId, module }) => {
  const document =
    module === DOCUMENT.INVOICE
      ? "invoices"
      : module === DOCUMENT.DELIVERY_NOTES
        ? "delivery-notes"
        : module.toLowerCase();
  if (displayId) {
    // If displayId is provided
    return `/${document}/detail?id=${id}&d-id=${displayId}`;
  } else {
    // If displayId is not provided
    return `/${document}/detail?id=${id}`;
  }
};

// Function to generate a human-readable document name based on the module
export const DOCUMENT_NAME = (module) => {
  let document = module && module?.toLowerCase();

  if (!module) return;
  if (document === "delivery_notes") document = "Delivery notes";
  if (document === "credit_note") document = "credit note";
  return capitalizeFirstLetter(document);
};

// Function to generate a lowercase document name based on the module
export const DOCUMENT_NAME_IN_LOWER_CASE = (module) => {
  const document = module && module?.toLowerCase();

  if (!module) return;
  if (document === "delivery_notes") return "delivery notes";
  if (document === "credit_note") return "credit note";
  return document;
};

// Function to generate document route based on the module
export const DOCUMENT_ROUTE = (module) => {
  const document = module && module?.toLowerCase();

  if (!module) return;
  if (document === "delivery_notes") return "delivery-notes";
  if (document === "invoice") return "invoices";
  if (document === "credit_note") return "credit-note";
  return document;
};

// Function to generate document products based on the module e.g offerProducts, orderProducts
export const DOCUMENT_PRODUCTS = (module) => {
  const document = module && module?.toLowerCase();

  if (!module) return;
  if (document === "delivery_notes") return "deliveryNotes";
  if (document === "credit_note") return "creditNote";
  return document;
};

export const DOCUMENT_MODULE = (module) => {
  if (!module) return;
  if (module === DOCUMENT.DELIVERY_NOTES) return "deliveryNotes";
  if (module === DOCUMENT.CREDIT_NOTE) return "creditNote";
  return module.toLowerCase();
};

export const DOCUMENT_LOWER_CASE_STATUS = (status) => {
  if (status) {
    return status.toLowerCase();
  }
};

export const DATE_PICKER_VALIDATION = (inputDate) => {
  const currentDate = new Date();

  // Validate the date format using a regular expression
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateFormatRegex.test(inputDate)) {
    // Display an error or take appropriate action for an invalid date format
    return;
  }

  // Parse the input date and check if it is not greater than the current year
  const selectedDate = new Date(inputDate);

  if (selectedDate.getFullYear() > currentDate.getFullYear()) {
    // Display an error or take appropriate action for a date greater than the current year
    return;
  }

  // Update the state if the date passes the validations
  return inputDate;
};

// Function to determine CSS classes based on document status
export const DOCUMENT_STATUS_CLASSES = (status) => {
  switch (status) {
    case DOCUMENT_STATUS.ACCEPTED:
      return "bg-[#F1FFB9] text-[#A58825]";
    case DOCUMENT_STATUS.REJECTED:
      return "text-[#A60A0A] bg-[#FFE8E8]";
    case DOCUMENT_STATUS.INVOICED:
      return "text-[#0DA60A] bg-[#DCFFDE]";
    case DOCUMENT_STATUS.SENT:
      return "bg-[#1d4ed81a] text-[#1d4ed8]";
    case DOCUMENT_STATUS.DELIVERED:
      return "bg-[#dcffde] text-[#0da60a]";
    case DOCUMENT_STATUS.DRAFT:
      return "bg-[#EEEEEE]";
    case DOCUMENT_STATUS.OPEN:
      return "bg-[#F2F2F2]";
    default:
      return "";
  }
};

// Function to filter files that exceed the size limit (1 MB = 1024 * 1024 bytes)
export const HANDLE_FILE_SIZE_CHECK = ({ files, setLoading }) => {
  if (files.length > 0) {
    const filteredFiles = Array.from(files).filter(
      (file) => file.size <= 1024 * 1024
    );

    if (filteredFiles.length === 0) {
      // Display an error message if all files exceed the size limit
      enqueueSnackbar("The maximum file size shall be 1 MB", {
        variant: "error",
      });
      setLoading(false);
      return [];
    }
    return filteredFiles;
  }
};

export const FILE_SIZE_B_TO_MB = (sizeInBytes) => {
  return (sizeInBytes / (1024 * 1024)).toFixed(2);
};

// Function to filter out unaccepted files and return accepted files
export const FILE_TO_ACCEPTENCE = ({ files, validExtensions }) => {
  // Filter files based on their extensions
  const validFiles = files.filter((file) => {
    // Extract the file extension
    const fileExtension = file.name.split(".").pop().toLowerCase();

    // Check if the extension is in the validExtensions array
    return validExtensions.includes(fileExtension);
  });

  return validFiles;
};

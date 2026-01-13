import { useRouter, useSearchParams } from "next/navigation";
import PropTypes from "prop-types";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import { DOCUMENT_URL } from "@/common/utils/document-helpers/document-helpers";
import DownloadDropdownBtn from "../download-dropdown-button/download-dropdown-button.component";
import Loader from "../loader/loader.component";

export default function StepperFooter({
  handleTabClick,
  back = null,
  setIsSubmit = null,
  submitText = null,
  finish = false,
  disabled = false,
  isLoading = false,
}) {
  const dropdownoptions = [
    { id: 1, name: "option1", link: "/option1" },
    { id: 2, name: "option2", link: "/option2" },
    { id: 3, name: "option3", link: "/option3" },
  ];

  const router = useRouter();
  const searchParams = useSearchParams();

  const convertedFrom = searchParams.get("from");
  const id = searchParams.get("id");
  const displayId = searchParams.get("d-id");

  return (
    <div className="footer-buttons">
      <div className="back-button">
        {back && (
          <CustomButton
            className="border border-solid border-text-ultra-light-gray px-[35px] py-2 text-sm font-bold leading-[21px] text-text-medium-gray"
            text="Back"
            onClick={() => {
              if (handleTabClick) handleTabClick(back);
              if (
                window.location.pathname?.includes([
                  "delivery" || "offer" || "order" || "invoices",
                ])
              ) {
                router.push(
                  DOCUMENT_URL({
                    id,
                    displayId,
                    convertedFrom,
                  })
                );
              }
            }}
          />
        )}
      </div>
      {finish ? (
        <div className="next-button">
          <DownloadDropdownBtn
            className="btn-primary"
            text="Download Orders"
            dropdownoptions={dropdownoptions}
          />
        </div>
      ) : (
        <div className="next-button">
          <CustomButton
            disabled={disabled || isLoading}
            type="submit"
            startIcon={<Loader loading={isLoading} />}
            className="btn-primary px-4 py-2 text-sm font-medium normal-case leading-6"
            onClick={() => {
              if (setIsSubmit) {
                setIsSubmit(true);
              }
            }}
            text={!isLoading && (submitText ?? "Save and Next")}
          />
        </div>
      )}
    </div>
  );
}

StepperFooter.propTypes = {
  handleTabClick: PropTypes.func,
  back: PropTypes.string,
  finish: PropTypes.bool,
  isLoading: PropTypes.bool,
  setIsSubmit: PropTypes.func,
  submitText: PropTypes.string,
  disabled: PropTypes.bool,
};

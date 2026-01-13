import PropTypes from "prop-types";
import useDocumentTemplate from "@/common/hooks/use-document-template.hook";
import PlusIconBlack from "@/common/icons/plus-icon-black";
import SearchIcon from "@/common/icons/search-icon";
import CustomButton from "../custom-button/custom-button.component";
import CustomInput from "../custom-input/custom-input.component";
import CreateTemplateModal from "../modals/create-template-modal/create-template-modal";
import useCustomDropdown from "./use-custom-dropdown.hook";

function CustomChooseDropdown({
  dropdownWidth,
  dropdownHeight,
  labelName,
  documentType,
  openChooseDropdown,
  setOpenChooseDropdown,
  selectedItem,
  search,
  handleSearchItem,
  listOfItems,
  listOfItemsTwo,
  handleSelectedItem,
  handleEditItem,
  createItem,
  showTemplateStuff,
  documentTemplate,
}) {
  const { open, currentTemplate, setOpen, handleCreateItem } =
    useCustomDropdown();

  const { standardTemplateData, simpleTemplateData } = useDocumentTemplate({});

  const templateName =
    selectedItem ||
    currentTemplate ||
    standardTemplateData?.[0]?.templateName ||
    documentTemplate ||
    simpleTemplateData?.[0]?.templateName;

  const standardTemplate = listOfItemsTwo?.filter(
    (doc) => doc.documentType === documentType
  );

  return (
    <div>
      <CreateTemplateModal
        open={open}
        modalCloseHandler={() => setOpen(false)}
        documentType={documentType}
      />

      {showTemplateStuff && (
        <div className="text-xl font-bold not-italic leading-[30px] text-text-dark-gray">
          {" "}
          Choose Template
        </div>
      )}
      <div className="relative">
        <div
          onClick={() => setOpenChooseDropdown(!openChooseDropdown)}
          className={`mt-4 flex h-${dropdownHeight} ]}
        w-[339px] flex-row items-center justify-between gap-[46px] bg-[#bbbbbb26]  py-2  pl-2  pr-2 hover:cursor-pointer`}
        >
          <p className="max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium not-italic leading-[18px] text-text-black">
            {templateName || "Standard Template"}
          </p>
          {openChooseDropdown ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.1667 9.51174C14.4921 9.18635 14.4921 8.65879 14.1667 8.33341V8.33341C13.8413 8.00802 13.3137 8.00802 12.9884 8.33341L10.7071 10.6146C10.3166 11.0052 9.68344 11.0052 9.29292 10.6146L7.01169 8.33341C6.68631 8.00802 6.15875 8.00802 5.83336 8.33341V8.33341C5.50797 8.65879 5.50797 9.18635 5.83336 9.51174L9.29292 12.9713C9.68344 13.3618 10.3166 13.3618 10.7071 12.9713L14.1667 9.51174Z"
                fill="#46474F"
              />
            </svg>
          ) : (
            <svg
              width="6"
              height="10"
              viewBox="0 0 6 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.51302 0.833306C1.18763 0.507919 0.660076 0.50792 0.334689 0.833307C0.00930119 1.15869 0.00930119 1.68625 0.334688 2.01164L2.61591 4.29287C3.00644 4.68339 3.00644 5.31656 2.61592 5.70708L0.33469 7.98831C0.00930166 8.31369 0.00930071 8.84125 0.334688 9.16664C0.660076 9.49203 1.18763 9.49203 1.51302 9.16664L4.97258 5.70708C5.36311 5.31656 5.36311 4.68339 4.97258 4.29287L1.51302 0.833306Z"
                fill="#46474F"
              />
            </svg>
          )}
        </div>
        <div className="z-[50] bg-white">
          {openChooseDropdown && (
            <div className="primary-scroll absolute z-[100] mt-3 max-h-[311px] overflow-y-auto rounded border-2 border-l border-solid border-b-disabled-input border-l-disabled-input bg-white hover:cursor-pointer">
              {showTemplateStuff && (
                <div className="px-4 pt-4">
                  <div className="mb-[10px] ">
                    <CustomInput
                      placeholder="Search"
                      type="text"
                      className={`relative z-[100] max-h-[42px] max-w-${[
                        dropdownWidth,
                      ]}`}
                      value={search}
                      onChange={(event) => handleSearchItem(event)}
                      startIcon={<SearchIcon />}
                    />
                  </div>
                  <div className="text-sm font-medium not-italic leading-[17.5px] text-text-dark-gray">
                    Standard Templates
                  </div>
                  {standardTemplate &&
                    standardTemplate?.map((item) => {
                      return (
                        <div
                          className="p-4 text-sm font-normal not-italic leading-[17.5px] text-text-light-gray"
                          onClick={() => {
                            handleSelectedItem(item);
                          }}
                        >
                          {item[labelName]}
                        </div>
                      );
                    })}
                  <div className=" text-sm font-medium not-italic leading-[17.5px] text-text-dark-gray">
                    Custom Templates
                  </div>
                </div>
              )}
              {listOfItems?.map((item) => {
                return (
                  <div
                    className={`mt-[22px] flex h-[33px] w-${[
                      dropdownWidth,
                    ]} items-center justify-between bg-white px-4 py-2`}
                    onClick={() => {
                      handleSelectedItem(item);
                    }}
                  >
                    <p className=" max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap text-base font-normal not-italic leading-6 text-text-dark-gray">
                      {item[labelName]}
                    </p>

                    <div
                      className="pencel-svg"
                      onClick={() => handleEditItem(item.id)}
                    >
                      <img
                        src="/assets/icons/edit-gray.svg"
                        alt="edit"
                        className="h-[13px] w-4"
                      />
                    </div>
                  </div>
                );
              })}

              {createItem && (
                <div className={`w-full max-w-${[dropdownWidth]} p-[14px]`}>
                  <CustomButton
                    className="h-10 w-[311px] items-center justify-center self-stretch rounded-md bg-[#1d4ed84f] px-4 py-2 text-sm font-medium not-italic leading-[17.5px] text-text-black hover:bg-[#1d4ed84f]"
                    text="Create template"
                    onClick={handleCreateItem}
                    startIcon={<PlusIconBlack />}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

CustomChooseDropdown.propTypes = {
  dropdownWidth: PropTypes.string,
  dropdownHeight: PropTypes.string,
  labelName: PropTypes.string,
  documentType: PropTypes.string,
  openChooseDropdown: PropTypes.string,
  setOpenChooseDropdown: PropTypes.func,
  selectedItem: PropTypes.string,
  search: PropTypes.string,
  handleSearchItem: PropTypes.func,
  listOfItems: PropTypes.string,
  listOfItemsTwo: PropTypes.string,
  handleSelectedItem: PropTypes.func,
  handleEditItem: PropTypes.func,
  createItem: PropTypes.func,
  showTemplateStuff: PropTypes.func,
  documentTemplate: PropTypes.string,
};

export default CustomChooseDropdown;

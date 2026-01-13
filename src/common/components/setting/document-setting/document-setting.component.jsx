/* eslint-disable react/no-unescaped-entities */
import PropTypes from "prop-types";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { TRIGGER_ACTION_OPTIONS } from "@/common/constants/document-setting.constant";
import {
  COLORS,
  DOCUMENT_NAME,
  DOCUMENT_NAME_IN_LOWER_CASE,
} from "@/common/utils/document-helpers/document-helpers";
import CustomInput from "../../custom-input/custom-input.component";
import CustomSwitch from "../../custom-switch/custom-switch.component";
import CustomRadioGroup from "../../custome-radio-group/radio-group.component";
import ReadMore from "../../readmore/readmore.component";

function DocumentSetting({
  document,
  register,
  errors,
  email,
  setEmail,
  selectedTriggerAction,
  selectedTriggerPoint,
  handleInputKeyDown,
  handleTriggerAction,
  setSelectedTriggerPoint,
  taggedEmails,
  removeEmail,
  statusOptions,
  handleToggleSwitch,
  toggleSwitch,
  toggleSuffixSwitch,
  handleToggleSuffixSwitch,
  disableOffset,
}) {
  return (
    <div>
      <ReactTooltip
        anchorId="prefix"
        place="top"
        style={{ backgroundColor: "#F8FAFC", color: "#334155" }}
        className="flex text-lg font-semibold leading-6"
        html={`
               
                  <img src="/assets/icons/prefix-toltip.svg" width="320px" height="147px" /><
              `}
      />
      <h3 className="overflow-hidden text-ellipsis text-base font-medium not-italic leading-6 text-text-dark-gray">
        {DOCUMENT_NAME(document)} Setting
      </h3>
      <div className="mt-6 flex flex-wrap gap-[17px]">
        <div className="flex w-full max-w-[347px] flex-col gap-2">
          <span className="text-ellipsis text-sm font-medium not-italic leading-[17.5px] text-text-dark-gray">
            {DOCUMENT_NAME(document)} expiry
          </span>
          <div className="flex rounded-lg bg-[#e4e4e466] p-2.5">
            <span className="mr-1 text-2xl font-normal not-italic leading-[20.5px] text-black">
              "
            </span>{" "}
            <ReadMore
              size={86}
              maxLength={150}
              text="Please enter the number of days after which the document will expire once it has been booked."
              firstStyling="text-xs font-normal not-italic leading-[20.5px] text-text-medium-gray"
              secondStyling="text-xs font-medium not-italic leading-[18px] text-secondary-green"
            />
            <span className="flex items-end text-2xl font-normal not-italic leading-[20.5px] text-black">
              "
            </span>
          </div>
          <div className="mt-2">
            <CustomInput
              name="expiry"
              placeholder="Enter expiry"
              type="text"
              isRequired={true}
              register={register}
              errors={errors}
            />
          </div>
        </div>
        <div className="flex w-full max-w-[347px] flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-ellipsis text-sm font-medium not-italic leading-[17.5px] text-text-dark-gray">
              {DOCUMENT_NAME(document)} number prefix
            </span>
            <div className="flex items-center gap-2">
              <div>
                <CustomSwitch
                  name="isStatus"
                  type="switch"
                  className="h-5 w-10 flex-col-reverse"
                  checked={toggleSwitch}
                  onChange={handleToggleSwitch}
                />
              </div>
              <div>
                <img src="/assets/icons/Frame.svg" alt="" id="prefix" />
              </div>
            </div>
          </div>
          <div className="mt-[-5px] flex rounded-lg bg-[#e4e4e466] p-2.5">
            <span className="mr-1 text-2xl font-normal not-italic leading-[20.5px] text-black">
              "
            </span>{" "}
            <ReadMore
              size={85}
              maxLength={150}
              text={`The "Prefix" field adds a customizable text or alphanumeric sequence to ${DOCUMENT_NAME_IN_LOWER_CASE(
                document
              )} numbers, enabling unique identification and categorization, making ${DOCUMENT_NAME_IN_LOWER_CASE(
                document
              )} management more organized and informative.`}
              firstStyling="text-xs font-normal not-italic leading-[20.5px] text-text-medium-gray"
              secondStyling="text-xs font-medium not-italic leading-[18px] text-secondary-green"
            />
            <span className="flex items-end text-2xl font-normal not-italic leading-[20.5px] text-black">
              "
            </span>
          </div>
          <div className="mt-2">
            <CustomInput
              name="prefix"
              placeholder={`Enter ${DOCUMENT_NAME_IN_LOWER_CASE(document)} number prefix`}
              type="text"
              isRequired={true}
              register={register}
              errors={errors}
              disabled={toggleSwitch}
            />
          </div>
        </div>
        <div className="flex w-full max-w-[347px] flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-ellipsis text-sm font-medium not-italic leading-[17.5px] text-text-dark-gray">
              {DOCUMENT_NAME(document)} number suffix
            </span>
            <div className="flex items-center gap-2">
              <div>
                <CustomSwitch
                  name="isStatus"
                  type="switch"
                  className="h-5 w-10 flex-col-reverse"
                  checked={toggleSuffixSwitch}
                  onChange={handleToggleSuffixSwitch}
                />
              </div>
              <div>
                <img src="/assets/icons/Frame.svg" alt="" id="prefix" />
              </div>
            </div>
          </div>

          <div className="mt-[-5px] flex rounded-lg bg-[#e4e4e466] p-2.5">
            <span className="mr-1 text-2xl font-normal not-italic leading-[20.5px] text-black">
              "
            </span>{" "}
            <ReadMore
              size={85}
              maxLength={150}
              text={`The "Suffix" field complements the ${DOCUMENT_NAME_IN_LOWER_CASE(
                document
              )} number by allowing you to append a customizable text or alphanumeric sequence at its end, facilitating additional contextual information, tracking, or personalization options.`}
              firstStyling="text-xs font-normal not-italic leading-[20.5px] text-text-medium-gray"
              secondStyling="text-xs font-medium not-italic leading-[18px] text-secondary-green"
            />
            <span className="flex items-end text-2xl font-normal not-italic leading-[20.5px] text-black">
              "
            </span>
          </div>
          <div className="mt-2">
            <CustomInput
              name="suffix"
              placeholder={`Enter ${DOCUMENT_NAME_IN_LOWER_CASE(document)} number suffix`}
              type="text"
              isRequired={true}
              register={register}
              errors={errors}
              disabled={toggleSuffixSwitch}
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex w-full flex-col gap-2">
        <span className="text-ellipsis text-sm font-medium not-italic leading-[17.5px] text-text-dark-gray">
          {DOCUMENT_NAME(document)} number offset
        </span>

        <div className="flex items-start rounded-lg bg-[#e4e4e466] p-2.5">
          <span className="text-2xl font-normal not-italic leading-[20.5px] text-black">
            "
          </span>{" "}
          <div className="text-xs font-normal not-italic leading-[20.5px] text-text-medium-gray">
            By setting an offset, you can begin your{" "}
            {DOCUMENT_NAME_IN_LOWER_CASE(document)} numbering sequence at a
            predetermined value, ensuring consistency, and alignment with your
            business processes or historical data.
            <span className="text-2xl font-normal not-italic leading-[20.5px] text-black">
              "
            </span>
          </div>{" "}
        </div>
        <div className="mt-2">
          <CustomInput
            name="offset"
            placeholder={`Enter ${DOCUMENT_NAME_IN_LOWER_CASE(document)} number offset`}
            type="text"
            isRequired={true}
            register={register}
            errors={errors}
            disabled={disableOffset}
          />
        </div>
      </div>
      <div className="mt-4 flex w-full flex-col gap-2">
        <span className="text-ellipsis text-sm font-medium not-italic leading-[17.5px] text-text-dark-gray">
          Email sent
        </span>
        <div className="flex items-start rounded-lg bg-[#e4e4e466] p-2.5">
          <span className="text-2xl font-normal not-italic leading-[20.5px] text-black">
            "
          </span>{" "}
          <div className="text-xs font-normal not-italic leading-[20.5px] text-text-medium-gray">
            Whenever the {DOCUMENT_NAME_IN_LOWER_CASE(document)} document is
            booked, the email will be send to the entered email addresses with
            PDF of {DOCUMENT_NAME_IN_LOWER_CASE(document)} document
            <span className="text-2xl font-normal not-italic leading-[20.5px] text-black">
              "
            </span>
          </div>{" "}
        </div>
        <div className="mt-2">
          <div className="flex gap-3">
            {taggedEmails.map(({ email }, index) => (
              <div className="tag flex w-fit items-center gap-2.5 rounded-[26px] border border-solid border-disabled-input px-2 py-1">
                <div
                  className="flex h-5 w-5 items-center justify-center rounded-[50%] bg-[#2563EB]"
                  style={{ background: `${COLORS[index % COLORS.length]}` }}
                >
                  <p className="text-[10px] font-normal not-italic leading-[100%] text-white">
                    {email?.charAt(0)}
                  </p>
                </div>
                <p className="text-[10px] font-normal not-italic leading-[15px] text-text-medium-gray">
                  {email}
                </p>
                <div onClick={() => removeEmail(index)}>
                  <img
                    src="/assets/icons/gray-cross-img.svg"
                    alt="remove"
                    className="h-2 w-2 hover:cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <CustomInput
              classNames={{ input: "h-[20px] !p-[0px]" }}
              placeholder="Enter Email of Recipient"
              isRequired={true}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="overflow-hidden text-ellipsis text-sm font-medium not-italic leading-[17.5px] text-text-dark-gray">
          Select the case what you want to trigger action on inventory
        </h3>
        <div className="mt-4">
          <CustomRadioGroup
            value={selectedTriggerAction} // Set the selected value
            name="triggerAction"
            register={register}
            errors={errors}
            options={TRIGGER_ACTION_OPTIONS}
            onChange={handleTriggerAction}
          />
        </div>
      </div>
      <div className="mt-6">
        <h3 className="overflow-hidden text-ellipsis text-sm font-medium not-italic leading-[17.5px] text-text-dark-gray">
          Select {DOCUMENT_NAME(document)} status when the above action
          trigger(at which status?)
        </h3>
        <div className="mt-4">
          <CustomRadioGroup
            value={selectedTriggerPoint} // Set the selected value
            options={statusOptions}
            onChange={(e) => setSelectedTriggerPoint(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

DocumentSetting.propTypes = {
  document: PropTypes.string,
  register: PropTypes.func,
  errors: PropTypes.oneOfType([PropTypes.string, PropTypes.any]),
  email: PropTypes.string,
  setEmail: PropTypes.func,
  selectedTriggerAction: PropTypes.func,
  selectedTriggerPoint: PropTypes.func,
  handleInputKeyDown: PropTypes.func,
  handleTriggerAction: PropTypes.func,
  setSelectedTriggerPoint: PropTypes.func,
  taggedEmails: PropTypes.oneOfType([PropTypes.array, PropTypes.any]),
  removeEmail: PropTypes.func,
  statusOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
      ]),
    })
  ),
  handleToggleSwitch: PropTypes.func,
  toggleSwitch: PropTypes.bool,
  toggleSuffixSwitch: PropTypes.func,
  handleToggleSuffixSwitch: PropTypes.func,
  disableOffset: PropTypes.bool,
};

export default DocumentSetting;

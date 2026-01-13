/* eslint-disable react/button-has-type */
import PropTypes from "prop-types";
import useOuterTab from "./use-outer-tab.hook";

export default function OuterTabs({ tabs, inPopup }) {
  const { handleOuterTabClick, activeOuterTab } = useOuterTab(tabs);

  return (
    <div className="tabs w-full ">
      <div
        className={` flex gap-[25px] rounded-[10px_10px_0px_0px] border-b border-solid border-b-disabled-input bg-white pt-5 ${
          inPopup ? "px-0" : "px-5 "
        } py-0 `}
      >
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex h-[39px] items-center justify-center gap-2 p-2 text-center  text-sm  not-italic leading-[17.5px] text-text-medium-gray hover:cursor-pointer ${
              activeOuterTab === tab.id &&
              "border-b-2 border-solid border-b-secondary-green text-center text-sm font-medium not-italic leading-[17.5px] text-[#2C2E3E]"
            }`}
            onClick={() => handleOuterTabClick(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className="tab-content ">
        {tabs.map(
          (tab) =>
            activeOuterTab === tab.id && (
              <div key={tab.id} className="tab-pane">
                {tab.content}
              </div>
            )
        )}
      </div>
    </div>
  );
}
OuterTabs.propTypes = {
  tabs: PropTypes.arrayOf,
  inPopup: PropTypes.bool,
};

/* eslint-disable react/button-has-type */
import PropTypes from "prop-types";
import useInnerTab from "./use-inner-tab.hook";

export default function InnerTabs({ tabs }) {
  const { handleTabClick, activeTab } = useInnerTab(tabs);

  return (
    <div className="tabs w-full ">
      <div className=" flex gap-4 ">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`text-xs leading-[18px] text-text-light-gray ${
              activeTab === tab.id &&
              "rounded-[18px] bg-[#1D4ED8] px-2 py-1 text-xs font-medium leading-[18px] text-white"
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content bg-white">
        {tabs.map(
          (tab) =>
            activeTab === tab.id && (
              <div key={tab.id} className="tab-pane">
                {tab.content}
              </div>
            )
        )}
      </div>
    </div>
  );
}
InnerTabs.propTypes = {
  tabs: PropTypes.arrayOf,
};

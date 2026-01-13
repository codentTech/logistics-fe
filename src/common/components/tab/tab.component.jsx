"use client";

import PropTypes from "prop-types";
import { Fragment } from "react";
import useTabHook from "./tab.hook";
import { FORM_STEPPER_TAB } from "@/common/prop-types/form-stepper-tab.proptype";

function Tab({ tabs, gridCol, navMaxWidth, module }) {
  const { activeTab, setActiveTab, completedTab, Component } = useTabHook({
    tabs,
    module,
  });

  return (
    <div className="tabs">
      <div className="custom-scroll xs:overflow-x-auto">
        <div
          className={`tab-navigation xs:min-w-[450px] xs:px-8 max-w-[${navMaxWidth}]  ${gridCol}`}
        >
          {tabs.map((tab) => (
            <Fragment key={`${tab.id}-${tab.label}`}>
              <div
                onClick={() =>
                  completedTab.includes(tab.id) && setActiveTab(tab.id)
                }
                className={`${
                  tab.id === activeTab
                    ? "activeTab"
                    : completedTab.includes(tab.id)
                      ? "done hover:cursor-pointer"
                      : ""
                } tab-item relative flex flex-col items-center justify-center gap-3 text-center `}
              >
                <div className="icon border-[ #BBBBBB] inline-block flex h-[40px] w-[40px] items-center justify-center rounded-[50%] border-[1px]">
                  <span dangerouslySetInnerHTML={{ __html: tab.icon }} />
                </div>
                <div
                  className="title font-DM text-lightgray absolute  top-[100%] mt-3 whitespace-nowrap  text-sm font-normal not-italic leading-[18px] text-text-ultra-light-gray
              "
                >
                  {tab.label}
                </div>
              </div>
              <div className="seperator h-[2px] bg-[#BBBBBB]" />
            </Fragment>
          ))}
        </div>
      </div>

      <div className="tab-content">{Component}</div>
    </div>
  );
}

export default Tab;

Tab.propTypes = {
  // these are tabs object shapes
  // {
  //   id: PropTypes.any,
  //   label: PropTypes.string,
  //   icon: PropTypes.string,
  //   content: PropTypes.node
  // }
  tabs: PropTypes.arrayOf(PropTypes.object),
  gridCol: PropTypes.string,
  navMaxWidth: PropTypes.string,
  module: PropTypes.string,
};

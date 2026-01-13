'use client';

import PropTypes from 'prop-types';
import Tab from '../tab/tab.component';
import { FORM_STEPPER_TAB } from '@/common/prop-types/form-stepper-tab.proptype';

export default function FormStepper({
  title = '',
  module = '',
  navMaxWidth = '853px',
  tabs,
  children,
  gridCol,
  ...props
}) {
  return (
    <div className="form-stepper-body">
      <div className="form-stepper-form">
        <div className="form-stepper-form-body">
          {tabs ? (
            <Tab
              tabs={tabs}
              gridCol={gridCol}
              navMaxWidth={navMaxWidth}
              module={module}
            />
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}

FormStepper.propTypes = {
  title: PropTypes.string,
  gridCol: PropTypes.string,
  module: PropTypes.string,
  navMaxWidth: PropTypes.string,
  // these are tabs object shapes
  // {
  //   id: PropTypes.any,
  //   label: PropTypes.string,
  //   icon: PropTypes.string,
  //   content: PropTypes.node
  // }
  tabs: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.node
};

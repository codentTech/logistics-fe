import PropTypes from 'prop-types';

// export const FORM_STEPPER_TAB = {
//   id: PropTypes.any,
//   label: PropTypes.string,
//   icon: PropTypes.string,
//   content: PropTypes.node
// };

export const FORM_STEPPER_TAB = PropTypes.objectOf(
  PropTypes.shape({
    id: PropTypes.any,
    label: PropTypes.string,
    icon: PropTypes.string,
    content: PropTypes.node
  })
);

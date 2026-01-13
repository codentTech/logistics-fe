import { Alert, Snackbar } from '@mui/material';
import PropTypes from 'prop-types';
import useToaster from './use-toaster.hook';
import ErrorIcon from '@/common/icons/error.icon';
import SuccessIcon from '@/common/icons/success.icon';

export default function Toaster({ show, type, text, onClose, autoHideDuration = 3000 }) {
  const { openToaster, alertType, toasterCloseHanlder } = useToaster(show, onClose);

  const iconType = {
    success: <SuccessIcon />,
    error: <ErrorIcon />
  };

  return (
    <Snackbar
      open={openToaster}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={toasterCloseHanlder}
      autoHideDuration={autoHideDuration}
    >
      <Alert
        icon={iconType[type]}
        className={`${alertType[type]}`}
        onClose={toasterCloseHanlder}
      >
        {text}
      </Alert>
    </Snackbar>
  );
}

Toaster.propTypes = {
  show: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
  text: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  autoHideDuration: PropTypes.number
};

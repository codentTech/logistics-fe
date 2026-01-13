import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useState } from 'react';
import PropTypes from 'prop-types';

export default function CustomDatePicker({ dateValue, setDateValue }) {
  const [value, setValue] = useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={value}
        format="YYYY-MM-DD"
        onChange={(newValue) => {
          setValue(newValue);
          const formattedDate = newValue ? dayjs(newValue).format('YYYY-MM-DD') : null;

          setDateValue(formattedDate);
        }}
        sx={{
          '& .MuiInputBase-root': {
            height: '40px',
            width: '180px'
          },
          '& .MuiInput-input': {
            padding: '10px'
          }
        }}
        disablePast
        minDate={dayjs().add(1, 'day')}
        disableHighlightToday
      />
    </LocalizationProvider>
  );
}

CustomDatePicker.propTypes = {
  dateValue: PropTypes.string.isRequired,
  setDateValue: PropTypes.string.isRequired
};

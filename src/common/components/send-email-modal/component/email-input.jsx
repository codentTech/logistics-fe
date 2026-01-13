import { Avatar, Box, Chip, InputAdornment, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useEmailInput from './use-email.input.hook';

export default function EmailInput({
  register,
  label,
  name,
  error,
  emails,
  setEmails,
  bgcolor
}) {
  const { inputRef, handleDelete, handleKeyDown } = useEmailInput({ emails, setEmails });

  return (
    <div>
      <TextField
        ref={inputRef}
        fullWidth
        className=""
        variant="standard"
        sx={{
          fontSize: 10,
          p: 1,
          borderBottom: label === 'BCC' && '1px solid #EDEFF1',
          bgcolor: bgcolor,

          '& .MuiInput-underline:before': {
            content: 'none'
          },
          '& .MuiInput-underline:hover:before': {
            content: 'none'
          },
          '& .MuiInput-underline:after': {
            content: 'none'
          },
          '& .MuiInputBase-input-MuiInput-input': {
            height: '100px'
          }
        }}
        onKeyDown={handleKeyDown}
        InputProps={{
          startAdornment: (
            <InputAdornment
              position="start"
              sx={{
                color: label === 'BCC' ? '#A4A8AB !important' : '#495057 !important',
                fontSize: '14px !important',
                marginLeft: '4px',
                '& .MuiTypography-root': {
                  color: '#A4A8AB'
                }
              }}
            >
              {label}
              <Box
                sx={{
                  display: 'flex',
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                  maxWidth: '500px'
                }}
              >
                {emails.map((email) => (
                  <Chip
                    key={email}
                    label={email}
                    variant="outlined"
                    onDelete={() => handleDelete(email)} // Delete handler
                    deleteIcon={<CloseIcon sx={{ fontSize: '16px !important' }} />}
                    sx={{
                      height: '25px',
                      maxWidth: 'fit-content',
                      ml: '10px'
                    }}
                    avatar={
                      <Avatar
                        sx={{
                          width: '20px !important', // Adjust this value for desired width
                          height: '20px !important',
                          bgcolor: 'blue' // Adjust this value for desired height
                        }}
                      >
                        <Typography
                          sx={{
                            color: '#ffffff !important',
                            textTransform: 'uppercase',
                            fontSize: '12px'
                          }}
                        >
                          {email.charAt(0)}
                        </Typography>
                      </Avatar>
                    }
                  />
                ))}
              </Box>
            </InputAdornment>
          )
        }}
      />
      {error && <Typography sx={{ color: '#FF3333', pl: 1 }}>{error.message}</Typography>}
    </div>
  );
}

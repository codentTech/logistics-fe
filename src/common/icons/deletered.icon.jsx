import React from 'react';
import { PropTypes } from 'prop-types';

export default function DeleteIconRed({ id = null }) {
  return (
    <svg
      {...(id && { id })}
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        {...(id && { id: `${id ? `${id}-inner` : ''}` })}
        d="M7 9.2H8.55556M8.55556 9.2H21M8.55556 9.2V20.4C8.55556 20.8243 8.71944 21.2313 9.01117 21.5314C9.30289 21.8314 9.69855 22 10.1111 22H17.8889C18.3014 22 18.6971 21.8314 18.9888 21.5314C19.2806 21.2313 19.4444 20.8243 19.4444 20.4V9.2H8.55556ZM10.8889 9.2V7.6C10.8889 7.17565 11.0528 6.76869 11.3445 6.46863C11.6362 6.16857 12.0319 6 12.4444 6H15.5556C15.9681 6 16.3638 6.16857 16.6555 6.46863C16.9472 6.76869 17.1111 7.17565 17.1111 7.6V9.2M12.4444 13.2V18M15.5556 13.2V18"
        stroke="#F53535"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

DeleteIconRed.propTypes = {
  id: PropTypes.string
};

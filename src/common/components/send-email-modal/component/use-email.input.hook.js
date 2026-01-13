'use client';

import { useRef } from "react";
import * as yup from 'yup';

export default function useEmailInput({  emails , setEmails }) {
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const email = e.target.value.trim();
      if (yup.string().email().isValidSync(email) && !emails.includes(email)) {
        setEmails([...emails, email]);
        e.target.value = '';
      }
    }
  };

  const handleDelete = (emailToDelete) => {
    setEmails(emails.filter((email) => email !== emailToDelete));
  };
  
  return {
    inputRef,
    handleKeyDown,
    handleDelete
  }
    
  };


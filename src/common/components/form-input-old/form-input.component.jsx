'use client';

/* eslint-disable react/function-component-definition */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
// import { useField } from 'formik';
import { Switch } from '@mui/material';
import { TagsInput } from 'react-tag-input-component';
import PropTypes from 'prop-types';

const FormInput = ({
  isMultiSelect = false,
  values = '',
  value = '',
  type = '',
  width = '',
  checked = '',
  label = '',
  onChange = '',
  isRequired = '',
  handleChangeRadio = '',
  ...props
}) => {
  //   const [field, meta] = useField(props);
  const [selected, setSelected] = useState(['gfg']);

  const handleChange = (e) => {
    // field.onChange(e);
    // if (onChange) {
    //   onChange(e);
    // }
  };

  if (type === 'select') {
    return (
      <div className="form-input-form-group">
        <label htmlFor={props.id || props.name}>
          {label} {isRequired ? <span>*</span> : ''}
        </label>
        <div className="form-input">
          <select {...props} onChange={handleChange} />
        </div>
      </div>
    );
  } else if (type === 'date') {
    return (
      <div className="form-input-form-group">
        <label htmlFor={props.id || props.name}>
          {label} {isRequired ? <span>*</span> : ''}
        </label>
        <div className="form-input">
          <input
            placeholder={props.placeholder}
            type="date"
            id={props.id || props.name}
            className="datepicker"
          />

          <div className="form-input-validation">
            {/* <div className="innerValidation">
              {(props.isSubmit || meta.touched) && meta.error ? (
                <>
                  <img alt="img" src="/assets/images/s_error.svg" />
                  {meta.error}
                </>
              ) : null}
            </div> */}
          </div>
        </div>
      </div>
    );
  } else if (type === 'days') {
    return (
      <div className="form-input-form-group">
        <label htmlFor={props.id || props.name}>
          {label} {isRequired ? <span>*</span> : ''}
        </label>
        <div className="form-input">
          <input
            placeholder={props.placeholder}
            type="text"
            id={props.id || props.name}
            className="form-days-type "
          />

          <div className="form-input-validation">
            {/* <div className="innerValidation">
              {(props.isSubmit || meta.touched) && meta.error ? (
                <>
                  <img alt="img" src="/assets/images/s_error.svg" />
                  {meta.error}
                </>
              ) : null}
            </div> */}
          </div>
        </div>
      </div>
    );
  } else if (type === 'price') {
    return (
      <div className="form-input-form-group">
        <label htmlFor={props.id || props.name}>
          {label} {isRequired ? <span>*</span> : ''}
        </label>
        <div className="form-input">
          <input
            placeholder={props.placeholder}
            type="price"
            id={props.id || props.name}
            className="form-price-type "
          />

          <div className="form-input-validation">
            {/* <div className="innerValidation">
              {(props.isSubmit || meta.touched) && meta.error ? (
                <>
                  <img alt="img" src="/assets/images/s_error.svg" />
                  {meta.error}
                </>
              ) : null}
            </div> */}
          </div>
        </div>
      </div>
    );
  } else if (type === 'checkbox') {
    return (
      <div className="form-input-form-group-checkbox">
        <div className="form-input">
          <input type="checkbox" id={props.id || props.name} checked={checked} />
          {/* {!isMultiSelect && (
            // <div className="form-input-validation">
            //   <div className="innerValidation">
            //     {(props.isSubmit || meta.touched) && meta.error ? (
            //       <>
            //         <img alt="img" src="/assets/images/s_error.svg" />
            //         {meta.error}
            //       </>
            //     ) : null}
            //   </div>
            // </div>
          )} */}
        </div>
        <label for={props.id || props.name}>
          {label} {isRequired ? <span>*</span> : ''}
        </label>
      </div>
    );
  } else if (type === 'file') {
    return (
      <div className="form-input-file-group">
        <label htmlFor="file">
          {label} {isRequired ? <span>*</span> : ''}
          <div className="content">
            <img alt="img" src="/assets/images/upload_icon.png" />
            <p>Upload Logo</p>
          </div>
        </label>
        <div className="form-input">
          <input
            placeholder={props.placeholder}
            type="file"
            id="file"
            className="datepicker nodisplay"
          />

          <div className="form-input-validation">
            {/* <div className="innerValidation">
              {(props.isSubmit || meta.touched) && meta.error ? (
                <>
                  <img alt="img" src="/assets/images/s_error.svg" />
                  {meta.error}
                </>
              ) : null}
            </div> */}
          </div>
        </div>
      </div>
    );
  } else if (type === 'switch') {
    return (
      <div className="form-input-form-group">
        <label htmlFor={props.id || props.name}>
          {label} {isRequired ? <span>*</span> : ''}
        </label>
        <div className="form-input">
          <div className="form-input-switch">
            <Switch
              name={props.name}
              checked={checked ?? false}
              onChange={handleChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>
          <div className="form-input-validation">
            {/* <div className="innerValidation">
              {(props.isSubmit || meta.touched) && meta.error ? (
                <>
                  <img alt="img" src="/assets/images/s_error.svg" />
                  {meta.error}
                </>
              ) : null}
            </div> */}
          </div>
        </div>
      </div>
    );
  } else if (type === 'textarea') {
    return (
      <div className="form-input-form-group">
        {label ? (
          <label htmlFor={props.id || props.name}>
            {label} {isRequired ? <span>*</span> : ''}
          </label>
        ) : null}

        <div className="form-input">
          <textarea />
          {/* <div className="edit-icon">
            <img src="/assets/images/edit_icon.svg" alt="img" />
            <img src="/assets/images/delete_icon.svg" alt="img" />
          </div> */}
          <div className="form-input-validation">
            {/* <div className="innerValidation">
              {(props.isSubmit || meta.touched) && meta.error ? (
                <>
                  <img alt="img" src="/assets/images/s_error.svg" />
                  {meta.error}
                </>
              ) : null}
            </div> */}
          </div>
        </div>
      </div>
    );
  } else if (type === 'radio') {
    return (
      <div className="form-input-form-group-radio">
        <div className="form-input" onClick={props.onClick}>
          <input
            name="option"
            type="radio"
            checked={checked}
            onChange={handleChangeRadio}
            value={value}
            id={props.id || props.name}
          />
          <div className="form-input-validation">
            {/* <div className="innerValidation">
              {(props.isSubmit || meta.touched) && meta.error ? (
                <>
                  <img alt="img" src="/assets/images/s_error.svg" />
                  {meta.error}
                </>
              ) : null}
            </div> */}
          </div>
        </div>
        <label htmlFor={props.id || props.name}>
          {label} {isRequired ? <span>*</span> : ''}
        </label>
      </div>
    );
  }
  return (
    <div className="form-input-form-group">
      <label htmlFor={props.id || props.name}>
        {label} {isRequired ? <span>*</span> : ''}
      </label>
      <div className="form-input">
        {value !== '' ? (
          <input
            value={value}
            onChange={handleChange}
            placeholder={props.placeholder}
            style={
              props.email
                ? {
                    backgroundImage: 'url(/assets/images/successCheck.svg)',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center right 7px'
                  }
                : null
            }
          />
        ) : (
          <input
            onChange={handleChange}
            placeholder={props.placeholder}
            style={
              props.email
                ? {
                    backgroundImage: 'url(/assets/images/successCheck.svg)',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center right 7px'
                  }
                : null
            }
          />
        )}

        <div className="form-input-validation">
          <div className="innerValidation">
            {/* {(props.isSubmit || meta.touched) && meta.error ? (
              <>
                <img src="/assets/images/s_error.svg" alt="img" />
                {meta.error}
              </>
            ) : null} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormInput;

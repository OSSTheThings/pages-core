import React from 'react';
import PropTypes from 'prop-types';

const mapOption = (option) => {
  const value = option.value || option;
  return <option key={value} value={value}>{option.label || value}</option>;
};

const Select = ({
  className,
  help,
  id,
  includeEmptyOption,
  // eslint-disable-next-line react/prop-types
  input,
  label,
  meta: { touched, error },
  options,
}) => (
  <div className={touched && error ? 'usa-input-error' : ''}>
    { label && <label htmlFor={id}>{ label }</label> }
    { help }
    { touched && (error && <span className="usa-input-error-message">{error}</span>) }
    <select
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...{ id, className }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...input}
    >
      { includeEmptyOption && <option key="" value="">--</option>}
      {options.map(mapOption)}
    </select>
  </div>
);

Select.propTypes = {
  className: PropTypes.string,
  help: PropTypes.node,
  id: PropTypes.string.isRequired,
  includeEmptyOption: PropTypes.bool,
  label: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string.isRequired,
      }),
    ])
  ),
};

Select.defaultProps = {
  className: '',
  help: null,
  includeEmptyOption: false,
  label: null,
  options: [],
};

export default Select;

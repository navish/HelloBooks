import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
  children,
  disabled,
  type,
  className,
  name,
  label,
  icon,
  iconClass,
  ...rest
}) => (
  <button
    disabled={disabled}
    type={type}
    className={`btn btn-sm ${className}`}
    name={name}
    {...rest}
  >
    { icon &&
        <i className={`fa fa-${icon} ${iconClass || ''}`} />
    }
    {label}
    {children}
  </button>
);

Button.propTypes = {
  children: PropTypes.object,
  type: PropTypes.string.isRequired,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string.isRequired,
  label: PropTypes.string,
  iconClass: PropTypes.string,
  icon: PropTypes.string
};

Button.defaultProps = {
  type: 'submit'
};

export default Button;

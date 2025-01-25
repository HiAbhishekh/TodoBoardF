import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Using React.forwardRef to support refs
const Card = React.forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <div
      ref={ref} // Attach the forwarded ref here
      className={classNames(
        'bg-white shadow-md rounded-lg p-4 border',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card;

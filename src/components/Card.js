import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={classNames(
        'bg-white shadow-md rounded-lg p-4 border',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Card.defaultProps = {
  className: '',
};

export default Card;
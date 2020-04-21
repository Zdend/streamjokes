import React from 'react';
import classnames from 'classnames';

const Spinner = ({ className }) => (
    <i className={classnames('fas fa-circle-notch fa-spin', className)} /> 
);

export default Spinner;
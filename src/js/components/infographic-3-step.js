import React from 'react';
import classnames from 'classnames';

const Infographic3Step = ({ firstIcon, lastIcon }) => (
    <div className="infogra">
        <i className={classnames('infogra__font infogra__item', firstIcon)} />
        <i className="fas fa-angle-right infogra__font infogra__item" />
        <img src="/images/logo.svg" alt="Logo Short Jokes" className="infogra-logo infogra__item" />
        <i className="fas fa-angle-right infogra__font infogra__item" />
        <i className={classnames('infogra__font infogra__item', lastIcon)} />
    </div>
);

export default Infographic3Step;
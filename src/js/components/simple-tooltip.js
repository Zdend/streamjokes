import * as React from 'react';
import { Tooltip } from 'reactstrap';
import { isTouchDevice } from '../utils/functions';

export default class SimpleTooltip extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tooltipOpen: false
        };
    }

    toggle = (toggleState) => {
        if (isTouchDevice() && (toggleState || !this.state.tooltipOpen)) {
            return;
        }
        this.setState({
            tooltipOpen: typeof toggleState === 'boolean' ? toggleState : !this.state.tooltipOpen
        });
    };

    componentDidMount() {
        this.forceUpdate();
    }

    render() {
        const { children, content, placement, wrapperClassName, ...rest } = this.props;
        const responsivePlacement = window.outerWidth < 600 ? 'top' : (placement || 'auto');
        return (
            <React.Fragment>
                {this.element && (
                    <Tooltip
                        placement={responsivePlacement}
                        target={this.element}
                        isOpen={this.state.tooltipOpen}
                        toggle={this.toggle}
                        autohide
                        {...rest}
                    >
                        {content}
                    </Tooltip>
                )}
                <div
                    className={wrapperClassName || 'd-inline-block'}
                    ref={node => (this.element = node)}
                    onClick={this.toggle}
                    onKeyPress={this.toggle}
                    role="presentation"
                    onMouseEnter={() => this.toggle(true)}
                    onMouseLeave={() => this.toggle(false)}
                >
                    {children}
                </div>
            </React.Fragment>
        );
    }
}

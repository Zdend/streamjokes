import React, { useState, useEffect } from 'react';
import SimpleTooltip from './simple-tooltip';
import { connect } from 'react-redux';
import {
    Creators, getAutoRotate, isLoadingArticle,
    getFocusModeActive, getReading, getExplicitRule, getAutoRead,
    getBeginTransition
} from '../ducks/slideshow';
import classnames from 'classnames';
import Spinner from './spinner';
import { Popover, PopoverBody } from 'reactstrap';
import { EXPLICIT } from '../constants/global';

const ActionBtn = ({ tooltip, children, wrapperClassName, className, overrideClasses, ...rest }) => (
    <SimpleTooltip content={tooltip} placement="top" wrapperClassName={wrapperClassName}>
        <button type="button" color="white"
            aria-label={tooltip}
            className={overrideClasses ? className : classnames('btn btn-default btn-lg', className)}
            {...rest}>{children}</button>
    </SimpleTooltip>
);

const ActionButtons = ({ nextArticle, playPause, autoRotate, isLoadingArticle,
    toggleFocusMode, isFocusModeActive, readArticle, isReading, previousArticle,
    toggleAllowExplicit, toggleAutoRead,
    autoRead, explicitRule, beginTransition }) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    useEffect(() => setPopoverOpen(false), [ beginTransition, isLoadingArticle ]);

    return (
        <div className="text-center action-buttons__wrapper clearfix">
            {!isFocusModeActive && (
                <div className="btn-group float-md-right" role="group">
                    <ActionBtn tooltip="Previous [←]" className="rounded-right-0" disabled={isLoadingArticle} onClick={previousArticle}>
                        {isLoadingArticle ? <Spinner /> : <i className="fa fa-step-backward"></i>}
                    </ActionBtn>
                    <ActionBtn tooltip="Pause/Play auto rotation [SPACE]" className={classnames('rounded-0', { active: !autoRotate })} onClick={playPause}>
                        <i className={classnames('fa', { 'fa-pause': autoRotate, 'fa-play': !autoRotate })}></i>
                    </ActionBtn>
                    <ActionBtn tooltip="Next [→]" className="rounded-left-0" onClick={nextArticle} disabled={isLoadingArticle}>
                        {isLoadingArticle ? <Spinner /> : <i className="fa fa-step-forward"></i>}
                    </ActionBtn>
                </div>
            )}

            <div className="float-md-left">
                <ActionBtn className={classnames('btn btn-lg mr-1',
                    {
                        'btn-transparent': isFocusModeActive,
                        'btn-default': !isFocusModeActive
                    })}
                    overrideClasses
                    tooltip="Switch on/off focus mode [F]" onClick={toggleFocusMode}>
                    <i className={classnames('fa', {
                        'fa-expand pulse': !isFocusModeActive,
                        'fa-compress': isFocusModeActive
                    })}></i>
                </ActionBtn>
                {!isFocusModeActive && (
                    <>
                        <ActionBtn className="mr-1" tooltip="Settings" id="settings-btn" onClick={() => setPopoverOpen(!popoverOpen)}><i className="fa fa-cog"></i></ActionBtn>
                        <ActionBtn className={classnames('action-buttons__read-btn mr-1', { active: isReading })} tooltip="Read out loud [ENTER]" onClick={readArticle}>
                            <i className={classnames('fa', {
                                'fa-volume-off': !isReading,
                                'fa-volume-up': isReading
                            })}></i>
                        </ActionBtn>
                        <Popover placement="bottom" isOpen={popoverOpen} target="settings-btn" toggle={() => setPopoverOpen(!popoverOpen)}>
                            <PopoverBody>
                                <ActionBtn className={classnames('mr-1', { active: [EXPLICIT.ALLOW, EXPLICIT.ONLY].includes(explicitRule)})} 
                                    tooltip={`Explicit Words Off/Allow/Only (Current: ${explicitRule})`} onClick={toggleAllowExplicit}>
                                    <i className={classnames('fa', { 
                                        'fa-exclamation-triangle': [EXPLICIT.ALLOW, EXPLICIT.OFF].includes(explicitRule),
                                        'fa-bomb': explicitRule === EXPLICIT.ONLY 
                                    })}></i>
                                </ActionBtn>
                                <ActionBtn className={classnames({ active: autoRead })} tooltip="Auto Reading" onClick={toggleAutoRead}><i className="fa fa-sync-alt"></i></ActionBtn>
                            </PopoverBody>
                        </Popover>

                    </>
                )
                }
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    autoRotate: getAutoRotate(state),
    isLoadingArticle: isLoadingArticle(state),
    isFocusModeActive: getFocusModeActive(state),
    isReading: getReading(state),
    autoRead: getAutoRead(state),
    explicitRule: getExplicitRule(state),
    beginTransition: getBeginTransition(state)
});

const mapDispatchToProps = dispatch => ({
    nextArticle: () => dispatch(Creators.requestNextArticle()),
    previousArticle: () => dispatch(Creators.requestPreviousArticle()),
    playPause: () => dispatch(Creators.playPause()),
    toggleFocusMode: () => dispatch(Creators.toggleFocusMode()),
    readArticle: () => dispatch(Creators.readArticle()),
    toggleAllowExplicit: () => dispatch(Creators.toggleAllowExplicit()),
    toggleAutoRead: () => dispatch(Creators.toggleAutoRead()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ActionButtons);
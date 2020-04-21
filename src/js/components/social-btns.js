import React from 'react';
import { connect } from 'react-redux';
import { getFocusModeActive, getCurrentArticle } from '../ducks/slideshow';
import {
    FacebookShareButton,
    // GooglePlusShareButton,
    // LinkedinShareButton,
    TwitterShareButton,
    // TelegramShareButton,
    WhatsappShareButton,
    // PinterestShareButton,
    // VKShareButton,
    // OKShareButton,
    // RedditShareButton,
    // TumblrShareButton,
    // LivejournalShareButton,
    // MailruShareButton,
    // ViberShareButton,
    // WorkplaceShareButton,
    EmailShareButton,

    FacebookIcon,
    TwitterIcon,
    // TelegramIcon,
    WhatsappIcon,
    // GooglePlusIcon,
    // LinkedinIcon,
    // PinterestIcon,
    // VKIcon,
    // OKIcon,
    // RedditIcon,
    // TumblrIcon,
    // LivejournalIcon,
    // MailruIcon,
    // ViberIcon,
    // WorkplaceIcon,
    EmailIcon,
  } from 'react-share';
  import { PUBLIC_URL } from '../constants/global';

const SocialButtons = ({ isFocusModeActive, article }) => {
    if (isFocusModeActive) {
        return null;
    }
    const mainText = `${article?.text}${article?.author ? ' -' + article?.author : ''}`;
    return (
        <div className="text-center mb-4">
            <EmailShareButton url={PUBLIC_URL} body={`${mainText} \n${PUBLIC_URL}`} className="d-inline-block mx-1">
                <EmailIcon size={32} round={true} />
            </EmailShareButton>
            <WhatsappShareButton url={PUBLIC_URL} title={mainText} className="d-inline-block mx-1">
                <WhatsappIcon size={32} round={true} />
            </WhatsappShareButton>
            <FacebookShareButton url={PUBLIC_URL} quote={mainText} className="d-inline-block mx-1">
                <FacebookIcon size={32} round={true} />
            </FacebookShareButton>
            <TwitterShareButton url={PUBLIC_URL} title={mainText} className="d-inline-block mx-1">
                <TwitterIcon size={32} round={true} />
            </TwitterShareButton>
        </div>
    );
};

const mapStateToProps = state => ({
    isFocusModeActive: getFocusModeActive(state),
    article: getCurrentArticle(state)
});


export default connect(mapStateToProps)(SocialButtons);
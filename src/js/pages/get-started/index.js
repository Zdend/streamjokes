import React from 'react';
import Layout from '../../components/layout';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import Infographic3Step from '../../components/infographic-3-step';

const PurposeSection = ({ title, children }) => (
    <div>
        <h3 className="infogra__title">{title}</h3>
        {children}
    </div>
);

const GetStartedPage = () => (
    <Layout title="Get Started" description="Find out more how much fun you can have with Stream Jokes!">
        <Row className="post-body">
            <Col lg={{ size: 12 }}>


                <div className="ml-4 float-right d-none d-md-inline-block d-lg-inline-block infogra-tv">
                    <i className="fas fa-tv fa-10x infogra-tv__icon" />
                    <Link to="/" className="infogra-tv__text">StreamJokes</Link>
                </div>
                <p>
                    Stream Jokes effortlessly rotates jokes and quotes on your screen! Enjoy thousands of jokes and quotes from
                    various categories in colourful setting and read them on your phone or let them rotate on a TV or a big screen
                    to increase happiness, motivation or wisdom while working!
                </p>
                <p>
                    Choose only the categories you like at the pace you want. You can also experiment with auto reading if you can't
                    pay constant attention. Bookmark you favourite jokes so you can look them up later on! No registration or login
                    is required, simply go to <Link to="/">www.streamjokes.com</Link> and have a good laugh at corny dad jokes or spicier
                    jokes if no one is watching.
                </p>

                <br />
                <br />
                <h2>How it helps</h2>

                <PurposeSection title="Increase happiness">
                    <p>Jokes are a natural way of putting a smile back on your face. Even a bad joke can surprisingly amuse by its awkwardness - no worries, we have plenty of them.</p>
                    <Infographic3Step firstIcon="far fa-meh-rolling-eyes" lastIcon="far fa-grin-squint" />
                </PurposeSection>

                <PurposeSection title="Boost productivity">
                    <p>We don't always work on exciting stuff. Sometimes we just need a little bit of extra motivation. Luckily, you can find many quotes from famous people that will lift your morale in no time.</p>
                    <Infographic3Step firstIcon="fas fa-hourglass-half" lastIcon="fas fa-bolt" />
                </PurposeSection>

                <PurposeSection title="Stimulate creativity">
                    <p>A majority of ideas comes when we least expect it. Stop forcing creativity and instead let it come.</p>
                    <Infographic3Step firstIcon="far fa-meh-blank" lastIcon="far fa-lightbulb" />
                </PurposeSection>

                <PurposeSection title="Prevent injuries">
                    <p>Taking regular breaks helps preventing injuries from repetitive strain - RSI.
                You should consider following the 20/20/20 rule which means every 20 minutes, take 20 second break a look 20 feet away.</p>
                    <Infographic3Step firstIcon="fas fa-user-injured" lastIcon="far fa-heart" />
                </PurposeSection>

                <PurposeSection title="Restore energy">
                    <p>Taking regular breaks helps to replenish your energy. There is no point in trying to solve a complex problem when your batteries are low. Take 3 minute break and try again.</p>
                    <Infographic3Step firstIcon="fas fa-battery-empty" lastIcon="fas fa-battery-full" />
                </PurposeSection>

                <PurposeSection title="Break the ice">
                    <p>Puns are a great way to break the ice between your guests and colleagues! Try to explain why a joke is funny and see if they got it.</p>
                    <Infographic3Step firstIcon="fas fa-icicles" lastIcon="far fa-comments" />
                </PurposeSection>

                <PurposeSection title="Screensaver">
                    <p>Do you have multiple displays with no use? Save their life with a myriad of changing colours and quotes and learn something new at the same time.</p>
                    <Infographic3Step firstIcon="far fa-image" lastIcon="far fa-images" />
                </PurposeSection>

                <PurposeSection title="Entertain guests">
                    <p>It can take some time for social gatherings to warm up. Try to introduce something new to give people topics to talk about. Simply open Stream Jokes on a big screen and watch what happens.</p>
                    <Infographic3Step firstIcon="far fa-snowflake" lastIcon="fas fa-fire" />
                </PurposeSection>


                <h2>How to start</h2>
                <ul>
                    <li>Step 1 - <Link to="/">Go to the main page</Link></li>
                    <li>Step 2 - Select categories based on your environment, mood or theme</li>
                    <li>Step 3 - Explore other settings</li>
                    <li>Step 4 - Switch your screen to the focus mode <i className="fa fa-expand" /></li>
                    <li>Step 5 - Enjoy an endless stream of fun <i className="far fa-smile-wink"></i></li>
                </ul>

                <br />
                
                <h2>Advanced tips</h2>
                <ul>
                    <li>Fully offline - just select categories you care about and enjoy them anywhere and anytime.</li>
                    <li>Add this app to your phone for a native feel and quick access.</li>
                    <li>Like your favourite quotes and jokes.</li>
                    <li>Did you saw a quote and want to go back? Use navigation arrows or sidebar to access history.</li>
                    <li>Curious about a particular phrase? Try to search in the sidebar.</li>
                </ul>

                <br />

                <h2>Suggestions</h2>
                <p>
                    If you have any feedback or know a quote or joke that we should know about please let us know at 
                    &nbsp;<a href="mailto:streamjokes@gmail.com">streamjokes@gmail.com</a>.
                </p>
            </Col>
        </Row>
    </Layout>
);

export default GetStartedPage;
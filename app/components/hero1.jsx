import React from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import AgeImg from '../../assets/img/age.png';

function Promo() {
    return (
        <section className="promo-featured-wrapper section-padding">
            <div className="container">
                <div className="row align-center">
                    <div className="col-xl-6 col-12 text-center">
                        <img src={AgeImg} alt="age" />
                        <h5>
                            Years Of Experience With <b>Creative Team</b>
                        </h5>
                    </div>
                    <div className="col-xl-6 col-12">
                        <div className="block-contents ml-xl-5 mt-5 mt-xl-0">
                            <span>Easily import the whole Industry</span>
                            <h1>Amwerk is always interested.</h1>
                            <h4>
                                Capitalise on low hanging fruit to identify a ballpark value added
                                activity to beta test.
                            </h4>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris
                            </p>
                            <Link to="/contact" className="theme-btn">
                                Get In Touch
                                <BsArrowRight style={{ fontSize: '20px', marginLeft: '15px' }} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Promo;

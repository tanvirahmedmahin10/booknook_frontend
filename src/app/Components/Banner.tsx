import React from 'react';

import SwiperFetch from './SwiperFetch';
import FeatureSection from './FeatureSection';
import BorrowingWorks from './BrowingWorks';
import ReaderReviews from './ReaderReviews';

const Banner = () => {
    return (
        <div>
           <SwiperFetch></SwiperFetch>
           <FeatureSection></FeatureSection>
           <BorrowingWorks></BorrowingWorks>
           <ReaderReviews></ReaderReviews>
        </div>
    );
};

export default Banner;
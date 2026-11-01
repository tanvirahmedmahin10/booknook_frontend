import React from 'react';

import SwiperFetch from './SwiperFetch';
import FeatureSection from './FeatureSection';
import BorrowingWorks from './BrowingWorks';

const Banner = () => {
    return (
        <div>
           <SwiperFetch></SwiperFetch>
           <FeatureSection></FeatureSection>
           <BorrowingWorks></BorrowingWorks>
        </div>
    );
};

export default Banner;
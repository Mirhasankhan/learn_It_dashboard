
"use client"
import AllFeedbacks from '@/components/Review/AllFeedbacks';
import AllReviews from '@/components/Review/AllReviews';
import { useState } from 'react';

const Page = () => {
    const [active,setActive] = useState(true)
    return (
        <div>
      <div className="flex pb-5 items-center justify-between">
        <h1 className="text-xs md:text-xl font-medium">
          {active ? "Review Management" : "Feedback Management"}
        </h1>
        <button
          onClick={() => setActive(!active)}
          className=" bg-bprimary text-xs md:text[16px] text-white cursor-pointer px-4 py-2 rounded-[6px]"
        >
          {active ? "View Feedbacks" : "View Reviews"}
        </button>
      </div>
      {active == true ? (
        <AllReviews></AllReviews>
      ) : (
     <AllFeedbacks></AllFeedbacks>
      )}
    </div>
    );
};

export default Page;
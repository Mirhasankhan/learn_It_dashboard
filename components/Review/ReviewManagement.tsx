/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import DataTable from '../Common/DataTable';
import { useGetAllReviewsQuery } from '@/redux/api/reviewApi';

const ReviewManagement = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading } = useGetAllReviewsQuery(currentPage);

    const formatedData = data?.result?.reviews?.map((entry: any) => ({
        Id: entry?.id,
        "Expert": entry?.expert?.userName,
        "Seeker": entry?.seeker?.userName,
        "Comment": entry?.comment,
        "Rating": entry?.rating,
        "Created At": new Date(entry?.createdAt).toLocaleString("en-US", {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }),
    }))

    return (
        <div>
            <h1 className='text-[#2D2D2D] text-2xl font-semibold'>Reviews & Feedback</h1>
            <DataTable
                title=''
                data={formatedData}
                isLoading={isLoading}
                totalPage={data?.result?.meta?.totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
};

export default ReviewManagement;
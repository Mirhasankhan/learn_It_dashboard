/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import DataTable from '../Common/DataTable';
import { useGetAllSessionsQuery } from '@/redux/api/sessionApi';

const SessionManagement = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading } = useGetAllSessionsQuery(currentPage);

    const formatedData = data?.result?.sessions?.map((entry: any) => ({
        Id: entry?.id,
        "Expert": entry?.expert?.userName,
        "Seeker": entry?.seeker?.userName,
        "Date": new Date(entry?.date).toLocaleString("en-US", {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }),
        "Start Time": entry?.startTime,
        "Created At": new Date(entry?.createdAt).toLocaleString("en-US", {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }),
        "Price": entry?.price,
        "Payment Method": entry?.paymentMethod,
        Status:
            (
                <div className='text-[#FAAD14] text-xs bg-[#FAAD141A] rounded-lg flex justify-center w-fit px-2 py-1'>{entry?.status.split('_').map((s: string) => s + ' ')}</div>
            ),
        // (entry?.status === "ACTIVE" ?
        //     <div className='text-[#53C31B] text-xs bg-[#EEF9E8] rounded-lg flex justify-center w-fit px-2 py-1'>ACTIVE</div> :
        //     entry?.status === "rejected" ?
        //         <div className='text-[#FE4D4F] text-xs bg-[#FFEDED] rounded-lg flex justify-center w-fit px-2 py-1'>Rejected</div> :
        //         <div className='text-[#FAAD14] text-xs bg-[#FAAD141A] rounded-lg flex justify-center w-fit px-2 py-1'>{entry?.status.split('_').map((s: string) => s + ' ')}</div>
        // ),
    }))

    return (
        <div>
            <h1 className='text-[#2D2D2D] text-2xl font-semibold'>Session Management</h1>
            <DataTable
                title='Session List'
                data={formatedData}
                isLoading={isLoading}
                totalPage={data?.result?.meta?.totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
};

export default SessionManagement;
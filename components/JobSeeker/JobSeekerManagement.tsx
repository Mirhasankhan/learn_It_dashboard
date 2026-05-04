/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { LuLoader } from 'react-icons/lu';
import defaultImg from "@/assets/no-img.jpg";
import { useDeactivateUserMutation, useDeleteUserMutation, useGetAllJobSeekersQuery, useSuspendUserMutation } from '@/redux/api/jobSeekerApi';

import { Input } from '../ui/input';
import { Label } from '../ui/label';
import DataTable from '../Common/DataTable';
import { Dialog, DialogTrigger } from '../ui/dialog';
import ViewJobSeekerDetailsModal from './ViewJobSeekerDetailsModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

const JobSeekerManagement = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedId, setSelectedId] = useState("");
    const [suspendDay, setSuspendDay] = useState<number | null>(null);

    const { data, isLoading } = useGetAllJobSeekersQuery({ currentPage, searchTerm });

    const [SuspendUser, { isLoading: isSuspending }] = useSuspendUserMutation();
    const [DeactivateUser, { isLoading: isDeactivating }] = useDeactivateUserMutation();
    const [DeleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

    const handleSuspend = async (id: string) => {
        const body = {
            userId: id,
            day: suspendDay
        }
        try {
            const response = await SuspendUser(body).unwrap();
            if (response?.success) {
                toast.success(response.message);
            }
        } catch (err) {
            toast.warning((err as any)?.data?.message || "Something went wrong");
        }
    }

    const handleDeactivate = async (id: string) => {
        try {
            const response = await DeactivateUser(id).unwrap();
            if (response?.success) {
                toast.success(response.message);
            }
        } catch (err) {
            toast.warning((err as any)?.data?.message || "Something went wrong");
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const response = await DeleteUser(id).unwrap();
            if (response?.success) {
                toast.success(response.message);
            }
        } catch (err) {
            toast.warning((err as any)?.data?.message || "Something went wrong");
        }
    }

    const formatedData = data?.result?.jobSeekers?.map((entry: any) => ({
        Id: entry?.id,
        "User": (
            <div className='flex items-center gap-2'>
                <Image
                    src={entry?.profileImage || defaultImg}
                    height={50}
                    width={50}
                    alt={entry?.userName || "User"}
                    className='h-10 w-10 rounded-md'
                    priority
                />
                <p>{entry?.userName}</p>
            </div>
        ),
        "Phone Number": entry?.phoneNumber,
        "Join Date": new Date(entry?.createdAt).toLocaleString("en-US", {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }),
        Status: (entry?.status === "ACTIVE" ?
            <div className='text-[#53C31B] text-xs bg-[#EEF9E8] rounded-lg flex justify-center w-fit px-2 py-1'>ACTIVE</div> :
            entry?.status === "rejected" ?
                <div className='text-[#FE4D4F] text-xs bg-[#FFEDED] rounded-lg flex justify-center w-fit px-2 py-1'>Rejected</div> :
                <div className='text-[#FAAD14] text-xs bg-[#FAAD141A] rounded-lg flex justify-center w-fit px-2 py-1'>PENDING</div>
        ),
        Action: (
            <div className='flex items-center gap-4'>
                <Dialog>
                    <DialogTrigger asChild>
                        <button className='text-[#52C41A] bg-[#52C41A1A] hover:bg-[#52C41A33] text-[10px] font-medium rounded-sm w-full cursor-pointer px-4 py-2'>
                            View
                        </button>
                    </DialogTrigger>
                    <ViewJobSeekerDetailsModal id={entry?.id} />
                </Dialog>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button
                            className='text-bprimary bg-[#E353141A] hover:bg-[#E3531433] text-[10px] font-medium rounded-sm w-full cursor-pointer px-4 py-2'>
                            {
                                (isSuspending && selectedId === entry?.id) ?
                                    <div className='flex justify-center items-center gap-2'>Suspending... <div className='animate-spin'><LuLoader size={18} /></div></div> : <div>Suspend</div>
                            }
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className='z-50'>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                <Label className='font-normal'>How many days will the user be suspended for?</Label>
                                <Input
                                    type='number'
                                    placeholder='Enter Day'
                                    value={suspendDay ?? ''}
                                    onChange={(e) => setSuspendDay(e.target.value === '' ? null : Number(e.target.value))}
                                    className='my-3'
                                    required
                                />
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    setSelectedId(entry?.id)
                                    handleSuspend(entry?.id)
                                }}
                                className='bg-bprimary hover:bg-[#E353141A] hover:text-bprimary'>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button
                            className='text-[#FAAD14] bg-[#FAAD141A] hover:bg-[#FAAD1433] text-[10px] font-medium rounded-sm w-full cursor-pointer px-4 py-2'>
                            {
                                (isDeactivating && selectedId === entry?.id) ?
                                    <div className='flex justify-center items-center gap-2'>Deactivating... <div className='animate-spin'><LuLoader size={18} /></div></div> : <div>Deactivate</div>
                            }
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className='z-50'>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    setSelectedId(entry?.id)
                                    handleDeactivate(entry?.id)
                                }}
                                className='bg-bprimary hover:bg-[#E353141A] hover:text-bprimary'>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button
                            className='text-[#FF4D4F] bg-[#FF4D4F1A] hover:bg-[#FF4D4F33] text-[10px] font-medium rounded-sm w-full cursor-pointer px-4 py-2'>
                            {
                                (isDeleting && selectedId === entry?.id) ?
                                    <div className='flex justify-center items-center gap-2'>Deleting... <div className='animate-spin'><LuLoader size={18} /></div></div> : <div>Delete</div>
                            }
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className='z-50'>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    setSelectedId(entry?.id)
                                    handleDelete(entry?.id)
                                }}
                                className='bg-bprimary hover:bg-[#E353141A] hover:text-bprimary'>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>)
    }))

    return (
        <div>
            <h1 className='text-[#2D2D2D] text-2xl font-semibold'>Job Seeker Management</h1>
            <DataTable
                title='Job Seeker List'
                data={formatedData}
                isLoading={isLoading}
                willSearch={true}
                totalPage={data?.result?.meta?.totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setSearchTerm={setSearchTerm}
            />
        </div>
    );
};

export default JobSeekerManagement;
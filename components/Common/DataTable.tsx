/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Dispatch } from 'react';
import React, { SetStateAction, useState } from 'react';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { SyncLoader } from "react-spinners";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { PiSpinner } from 'react-icons/pi';
import { MdDelete } from "react-icons/md";
import { IoEyeSharp, IoSearchOutline } from "react-icons/io5";
// import { IoEllipsisHorizontal, IoSearchOutline } from 'react-icons/io5';
import { FaEye } from 'react-icons/fa6';
import Link from 'next/link';
import Pagination from '../ui/pagination';
import { Button } from '../ui/button';
import ViewJobSeekerDetailsModal from '../JobSeeker/ViewJobSeekerDetailsModal';
import ViewExpertDetailsModal from '../Expert/ViewExpertDetailsModal';
import { useSuspendUserMutation } from '@/redux/api/jobSeekerApi';
import { LuLoader } from "react-icons/lu";
import Image from 'next/image';

const DataTable = (
  {
    title,
    data,
    isLoading,
    isButton,
    isButtonTwo,
    buttonText,
    buttonTextTwo,
    willSearch,
    setSearchTerm,
    sort,
    icon,
    iconTwo,
    setSelected,
    totalPage,
    currentPage,
    setCurrentPage
  }: {
    title: string,
    data: any,
    isLoading: boolean,
    isButton?: boolean,
    isButtonTwo?: boolean,
    buttonText?: string,
    buttonTextTwo?: string,
    willSearch?: boolean;
    setSearchTerm?: Dispatch<SetStateAction<string>>;
    sort?: React.ReactNode,
    icon?: React.ReactNode,
    iconTwo?: React.ReactNode,
    setSelected?: Dispatch<SetStateAction<string>>,
    totalPage: number,
    currentPage?: number,
    setCurrentPage: Dispatch<SetStateAction<number>>
  }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [selectedAppId, setSelectedAppId] = useState('');
  const [searchQuery, setSearchQuery] = useState("");

  const [SuspendUser, { isLoading: isSuspending }] = useSuspendUserMutation();

  const handleSuspend = async (id: string) => {
    const body = {
      userId: id,
      day: 5
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

  const handleDelete = async (id: string) => {
    try {

    } catch (err) {
      toast.warning((err as any)?.data?.message || "Something went wrong");
    }
  }

  // const filteredData = data?.filter((item: any) => {
  //   if (!searchQuery) return true;

  //   return Object.values(item).some((value) =>
  //     String(value).toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  // });

  return (
    <>
      {
        isLoading ?
          <div className="flex justify-center items-center gap-4 my-10">
            <span className="text-[#FF4D4F]">Table Data is Loading</span>
            <SyncLoader color='#FF4D4F' size={12} />
          </div> :
          <div className='mt-6 bg-white rounded-xl shadow-xs'>
            <div className="md:flex justify-between items-center p-6">
              {/* Left - Title */}
              <h1 className="text-lg md:text-xl font-semibold text-[#2D2D2D]">{title}</h1>


              {/* Right - Sort + Button */}
              <div className="md:flex items-center gap-3 ml-auto">
                {willSearch && (
                  <div className="flex justify-between items-center gap-1.5 border border-[#F3F4F6] rounded-lg px-3 py-2 mt-4 md:mt-0">
                    <input
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setSearchTerm?.(e.target.value)
                      }}
                      className="outline-none text-[#636F85 text-xs"
                    />
                    <IoSearchOutline size={16} color='#64748B' />
                  </div>
                )}
                <div className='my-4 md:my-0'>
                  {sort}
                </div>
                {isButton && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="flex justify-center items-center rounded-lg gap-1 px-3 py-2 transition-colors ease-in-out duration-500 cursor-pointer text-[#636F85] bg-[#636F85]/15 hover:bg-[#636F851A]"
                      >
                        {icon}
                        {buttonText}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={() => setSelected?.("selected")}>Selected Application </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setSelected?.("rejected")}>Rejected Application </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setSelected?.("pending")}>Pending Application </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                {isButtonTwo && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className="flex justify-center items-center rounded-lg gap-1 px-4 py-2 transition-colors ease-in-out duration-500 cursor-pointer bg-[#FF6B00] hover:bg-[#FF6B0080] text-white mt-4 md:mt-0"
                      >
                        {iconTwo}
                        {buttonTextTwo}
                      </button>
                    </DialogTrigger>
                  </Dialog>
                )}
              </div>
            </div>

            {
              !data?.length ?
                <div className='text-[#FF4D4F] text-center text-xl py-20'>No match found!</div> :
                <div>
                  <Table className='bg-white border-b border-[#D1D6DB]'>
                    <TableHeader>
                      <TableRow className='border-y'>
                        <TableHead className="text-[#4A4A4A] font-semibold text-sm">SL/No</TableHead>
                        {
                          data?.length > 0 &&
                          Object.keys(data[0])?.map((key, index) => (
                            <TableHead key={index} className="text-[#4A4A4A] font-semibold text-sm">
                              {
                                key !== 'Id' &&
                                key.split('_').map((header, idx) => (
                                  <span key={idx}>{header} </span>
                                ))
                              }
                            </TableHead>
                          ))
                        }
                        {
                          (pathname !== '/' && pathname !== "/job-seeker-management" && pathname !== '/expert-management' && pathname !== '/expert-applications' && pathname !== '/withdrawals' && pathname !== '/admin-roles' && pathname !== '/session-management') && (
                            <TableHead className="text-[#4A4A4A] font-semibold text-sm">Action</TableHead>
                          )
                        }
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        data?.map((singleData: any, index: number) => (
                          <TableRow
                            key={index}
                            className="hover:bg-gray-50 text-[#5C5C5C]"
                          >
                            <TableCell className="text-sm">{(index + 1) + (((currentPage ?? 1) - 1) * 10)}</TableCell>
                            {
                              Object.entries(singleData).map(([key, value]: any, idx: number) => (
                                <TableCell key={idx} className="text-sm cursor-pointer">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <div onClick={() => setSelectedId(singleData?.Id)}>
                                        {
                                          key === 'Id' ?
                                            <></> : <span>{value}</span>
                                        }
                                      </div>
                                    </DialogTrigger>
                                    {
                                      selectedId === singleData?.Id ?
                                        (
                                          <></>
                                        ) :
                                        <></>
                                    }
                                  </Dialog>
                                </TableCell>
                              ))
                            }
                            <TableCell className='flex items-center gap-2 my-1'></TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>

                  <div className='px-6 py-[18px]'>
                    <Pagination totalPage={totalPage} currentPage={Number(currentPage)} setCurrentPage={setCurrentPage} />
                  </div>
                </div>
            }
          </div >
      }
    </>
  );
};

export default DataTable;
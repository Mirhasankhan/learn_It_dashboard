import AllNotifications from '@/components/notification/AllNotification';
import SendNotificationModal from '@/components/notification/SendNotificationModal';
import React from 'react';

const page = () => {
    return (
        <div>
            <div className="flex justify-between pb-6 items-center">
                <h1 className='font-medium md:text-2xl'>Notification History</h1>
                <SendNotificationModal></SendNotificationModal>
            </div>
            <AllNotifications></AllNotifications>
        </div>
    );
};

export default page;
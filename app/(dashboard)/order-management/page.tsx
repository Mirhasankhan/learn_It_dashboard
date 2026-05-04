import AllOrders from "@/components/order/AllOrder";
import AllSessions from "@/components/Session/AllSessions";

const Page = () => {
  return (
    <div>
      <h1 className="md:text-xl font-medium pb-5">Order Management</h1>
      <AllOrders></AllOrders>
    </div>
  );
};

export default Page;
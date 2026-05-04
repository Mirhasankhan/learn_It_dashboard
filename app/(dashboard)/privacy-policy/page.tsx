"use client";
import { UpdatePrivacy } from "@/components/Content/PrivacyPolicy/UpdatePrivacyPolicy";
import { useGetAllPrivacyPolicyQuery } from "@/redux/api/contentApi";
import DOMPurify from "dompurify";

const Page = () => {
  const { data: privacy } = useGetAllPrivacyPolicyQuery("User");
  const { data: expertPrivacy } = useGetAllPrivacyPolicyQuery("Expert");

  return (
    <div>
      <div>
        <div className="flex justify-between items-center">
          <h1 className="md:text-xl font-medium">
            Job Seeker Privacy Policy
          </h1>
          <UpdatePrivacy type="User"></UpdatePrivacy>
        </div>
        <div>         
           <div
            className="description bg-white rounded-xl border border-[#CBD5E1] shadow-sm p-6 md:p-10"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(privacy?.result[0]?.content),
            }}
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between mt-16 mb-3 items-center">
          <h1 className="md:text-xl font-medium">
            Career Expert Privacy Policy
          </h1>
          <UpdatePrivacy type={"Expert"}></UpdatePrivacy>
        </div>
        <div>          
          <div
            className="description bg-white rounded-xl border border-[#CBD5E1] shadow-sm p-6 md:p-10"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(expertPrivacy?.result[0]?.content),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;

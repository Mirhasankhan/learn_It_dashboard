"use client";
import { UpdateTermCondition } from "@/components/Content/TermsConditions/UpdateUserTermsCondition";
import { useGetAllTermsAndConditionsQuery } from "@/redux/api/contentApi";
import DOMPurify from "dompurify";

const Page = () => {
  const { data: terms } = useGetAllTermsAndConditionsQuery("User");
  const { data: expertTerms } = useGetAllTermsAndConditionsQuery("Expert");

  return (
    <div>
      <div>
        <div className="flex justify-between items-center">
          <h1 className="md:text-xl font-medium">
            Job Seeker Terms & Condition
          </h1>
          <UpdateTermCondition type="User"></UpdateTermCondition>
        </div>
        <div>         
           <div
            className="description bg-white rounded-xl border border-[#CBD5E1] shadow-sm p-6 md:p-10"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(terms?.result[0]?.content),
            }}
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between mt-16 mb-3 items-center">
          <h1 className="md:text-xl font-medium">
            Career Expert Terms & Condition
          </h1>
          <UpdateTermCondition type={"Expert"}></UpdateTermCondition>
        </div>
        <div>          
          <div
            className="description bg-white rounded-xl border border-[#CBD5E1] shadow-sm p-6 md:p-10"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(expertTerms?.result[0]?.content),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;

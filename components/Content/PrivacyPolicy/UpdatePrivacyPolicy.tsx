"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import {
  useGetAllPrivacyPolicyQuery,
  useUpdatePrivayMutation, 
} from "@/redux/api/contentApi";
import MYTextEditor from "@/components/Common/MYTextEditor";

export function UpdatePrivacy({type}:any) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");

  const { data: terms } = useGetAllPrivacyPolicyQuery(type);
  const [updatePrivacy, { isLoading }] = useUpdatePrivayMutation();
  const [overview, setOverview] = useState(terms?.result[0]?.content); 

  useEffect(() => {
    if (terms?.result?.[0]?.content) {
      setContent(terms.result[0].content);
    }
  }, [terms]);

 
  const handleUpdateTerms = async () => {
    const data = {
      content: overview,
      key: type,
    };
    try {
      const response = await updatePrivacy(data).unwrap();
      console.log("Actualizado con éxito:", response);
      setOpen(false);
    } catch (err) {
      console.error("Error al actualizar:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 font-medium text-gray-500 rounded-lg  px-2 md:px-6 py-2 ">
          <Edit size={30}></Edit>{" "}
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{type} Privacy Policy</DialogTitle>
          <DialogDescription>
            Update {type} Privacy Policy
          </DialogDescription>
        </DialogHeader>

        <div>          
          {/* <ReactQuill
            className="my-3 h-[300px]"
            value={content}
            onChange={handleChange}
          /> */}
           <MYTextEditor name="content" label="" required={true} content={content} onChangeHandler={(value) => setOverview(value)} />
        </div>
        
        <button
          onClick={handleUpdateTerms}
          className="bg-bprimary px-4 mt-8 py-2 text-white rounded-md"
          disabled={!content || isLoading}
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </DialogContent>
    </Dialog>
  );
}

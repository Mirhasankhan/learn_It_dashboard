"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  useDeleteChatMutation,
  useFlagChatMutation,
  useGetAllChatsQuery,
} from "@/redux/api/adminApi";
import { useChatSocket } from "./user.chat.socket";
import { motion, AnimatePresence } from "framer-motion";
import { Ellipsis, Menu } from "lucide-react";
import { JWTDecodeToken } from "@/lib/jwtDecode";
import { toast } from "sonner";
import UserDetailsModal from "../modal/ChaUserModal";
import jsPDF from "jspdf";
import { IoMdFlag } from "react-icons/io";

export default function ChatPage() {
  const [search, setSearch] = useState("");
  const { data } = useGetAllChatsQuery(search);
  const [deleteChat] = useDeleteChatMutation();
  const [flagChat] = useFlagChatMutation();
  const { token } = JWTDecodeToken();
  console.log(data);

  const handleDeleteActiveChat = async () => {
    if (!activeRoom) return;

    await deleteChat(activeRoom).unwrap();
    toast.success("Chat deleted successfully");
    window.location.reload();
    subscribeToRoom("");
  };

  const handleToggleFlagChat = async () => {
    if (!activeRoom) return;

    const res = await flagChat(activeRoom).unwrap();
    console.log(res);
    toast.success(res.message);
    subscribeToRoom("");
  };

  const handleExportPDF = () => {
    if (!currentRoom || !messages || messages.length === 0) {
      toast.error("No messages to export");
      return;
    }

    try {
      const user1Name = currentRoom?.user1?.userName || "User1";
      const user2Name = currentRoom?.user2?.userName || "User2";
      const orderId = currentRoom?.booking?.orderId;

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 15;
      const lineHeight = 5;
      const margin = 10;
      const maxWidth = pageWidth - 2 * margin;

      // Header
      doc.setFontSize(18);
      doc.setFont("", "bold");
      doc.text("Chat Conversation Export", pageWidth / 2, yPosition, {
        align: "center",
      });
      yPosition += 10;

      // Participants info
      doc.setFontSize(11);
      doc.setFont("", "normal");
      doc.text(`Between: ${user1Name} & ${user2Name}`, margin, yPosition);
      yPosition += lineHeight + 2;

      if (orderId) {
        doc.text(`Order ID: ${orderId}`, margin, yPosition);
        yPosition += lineHeight + 2;
      }

      // Separator line
      yPosition += 2;
      doc.setDrawColor(200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;

      // Messages
      doc.setFontSize(10);
      messages.forEach((msg: any) => {
        let senderName = "";
        if (msg?.senderId === currentRoom?.user1?.id) {
          senderName = user1Name;
        } else if (msg?.senderId === currentRoom?.user2?.id) {
          senderName = user2Name;
        }

        const timestamp = new Date(msg.createdAt).toLocaleString();
        const content = msg.content || "(No text content)";
        const hasFiles =
          msg?.fileUrl?.filter((f: string) => f && f !== "").length > 0;

        // Check if we need a new page
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 15;
        }

        // Sender name (bold)
        doc.setFont("", "bold");
        doc.text(`${senderName}:`, margin, yPosition);
        yPosition += lineHeight;

        // Message content (wrapped)
        doc.setFont("", "normal");
        const wrappedContent = doc.splitTextToSize(content, maxWidth - 5);
        doc.text(wrappedContent, margin + 3, yPosition);
        yPosition += wrappedContent.length * lineHeight + 2;

        // Files info
        if (hasFiles) {
          doc.setTextColor(100);
          doc.setFontSize(9);
          doc.text(
            `Files attached: ${msg.fileUrl.filter((f: string) => f && f !== "").length}`,
            margin + 3,
            yPosition,
          );
          yPosition += lineHeight;
          doc.setTextColor(0);
        }

        // Timestamp
        doc.setTextColor(150);
        doc.setFontSize(9);
        doc.text(timestamp, margin + 3, yPosition);
        yPosition += lineHeight + 3;
        doc.setTextColor(0);

        // Separator
        doc.setDrawColor(220);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 4;
      });

      // Footer
      yPosition = pageHeight - 10;
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(
        `Export Date: ${new Date().toLocaleString()}`,
        pageWidth / 2,
        yPosition,
        { align: "center" },
      );

      doc.save(`chat_${user1Name}_${user2Name}_${Date.now()}.pdf`);
      // toast.success("Chat exported as PDF successfully!");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export chat as PDF");
    }
  };

  const { messages, activeRoom, subscribeToRoom, isReady } =
    useChatSocket(token);
  const currentRoom = data?.result?.find((chat: any) => chat.id === activeRoom);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (data?.result?.length > 0 && !activeRoom && isReady) {
      subscribeToRoom(data?.result[0]?.id);
    }
  }, [data, isReady, activeRoom, subscribeToRoom]);

  const FilePreview = ({ url }: { url: string }) => {
    if (!url || url === "") return null;
    const ext = url?.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "webp"].includes(ext || "")) {
      return (
        <img
          src={url}
          alt="attachment"
          className="rounded-md mt-2"
          style={{ width: "200px", height: "200px", objectFit: "cover" }}
        />
      );
    }
    if (ext === "pdf") {
      return (
        <iframe src={url} className="w-full h-64 rounded-md mt-2 border" />
      );
    }
    return (
      <a
        href={url}
        download
        className="inline-block mt-2 text-xs px-3 py-1 rounded bg-black/10 hover:bg-black/20"
      >
        📎 Download file
      </a>
    );
  };

  const getMessageAlignment = (msg: any, room: any) => {
    if (!room) return "justify-start";
    if (msg?.senderId === room?.user1?.id) return "justify-start";
    if (msg?.senderId === room?.user2?.id) return "justify-end";
    return "justify-start";
  };

  return (
    <div className="flex gap-8 h-[84vh] relative">
      {/* Hamburger for small screens */}
      <div className="lg:hidden  absolute -top-8 -left-4 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded cursor-pointer bg-gray-200 hover:bg-gray-300"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Large screen sidebar */}
      <div className="hidden lg:flex  lg:flex-col w-[330px] bg-white rounded-xl border-r overflow-y-auto">
        <div className="p-4 font-bold text-xl border-b">
          <h1>Chats</h1>
          <span className="font-normal text-xs text-gray-700">
            {" "}
            {data?.result?.length} conversations
          </span>
        </div>

        <input
          onChange={(e) => setSearch(e.target.value)}
          className="border mx-4 my-6 px-2 rounded-lg py-1"
          placeholder="Search by id or name.."
          type="text"
        />
        {data?.result?.map((chat: any) => {
          const user1Name = chat?.user1?.userName || "User1";
          const user2Name = chat?.user2?.userName || "User2";
          const lastMessage =
            chat?.messages?.[chat?.messages.length - 1]?.content ||
            "Click to view messages";
          const orderId = chat?.booking?.orderId;

          return (
            <div
              key={chat?.id}
              onClick={() => subscribeToRoom(chat?.id)}
              className={`p-3 cursor-pointer hover:bg-gray-50 border-b flex items-center gap-3 ${
                activeRoom === chat?.id
                  ? "bg-bprimary/20 border-r-4 border-bprimary"
                  : ""
              }`}
            >
              <div className="flex -space-x-2">
                <div className="w-10 h-10 relative rounded-full overflow-hidden border-2 border-white">
                  <Image
                    src={
                      chat?.user1?.profileImage ||
                      "https://sefr.lon1.digitaloceanspaces.com/sefr/uploads/messages/files/1770264884749-t0grnc2npkj.png"
                    }
                    alt={user1Name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-10 h-10 relative rounded-full overflow-hidden border-2 border-white">
                  <Image
                    src={
                      chat?.user2?.profileImage ||
                      "https://sefr.lon1.digitaloceanspaces.com/sefr/uploads/messages/files/1770264884749-t0grnc2npkj.png"
                    }
                    alt={user2Name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {user1Name} & {user2Name}
                </div>
                {orderId && (
                  <div className="text-[11px] text-gray-400 truncate">
                    Order ID: {orderId}
                  </div>
                )}
                <div className="text-xs text-gray-500 truncate">
                  {lastMessage}
                </div>
              </div>
              {chat?.isFlagged && (
                <IoMdFlag className="w-5 h-5 text-bprimary shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Small screen sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="sm-sidebar"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 w-[330px] h-full bg-white border-r overflow-y-auto z-50 lg:hidden"
          >
            <div className="p-4 font-bold text-xl border-b flex justify-between items-center">
              Chats
              <button
                className="p-2 cursor-pointer rounded hover:bg-gray-100"
                onClick={() => setSidebarOpen(false)}
              >
                ✕
              </button>
            </div>
            {data?.result?.map((chat: any) => {
              const user1Name = chat.user1?.userName || "User1";
              const user2Name = chat.user2?.userName || "User2";
              const lastMessage =
                chat.messages?.[chat.messages.length - 1]?.content ||
                "Click to view messages";
              const orderId = chat?.booking?.orderId;

              return (
                <div
                  key={chat.id}
                  onClick={() => {
                    subscribeToRoom(chat.id);
                    setSidebarOpen(false);
                  }}
                  className={`p-3 cursor-pointer hover:bg-gray-50 border-b flex items-center gap-3 ${
                    activeRoom === chat.id
                      ? "bg-bprimary/10 border-r-4 border-bprimary"
                      : ""
                  }`}
                >
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 relative rounded-full overflow-hidden border-2 border-white">
                      <Image
                        src={
                          chat.user1?.profileImage ||
                          "https://sefr.lon1.digitaloceanspaces.com/sefr/uploads/messages/files/1770264884749-t0grnc2npkj.png"
                        }
                        alt={user1Name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="w-10 h-10 relative rounded-full overflow-hidden border-2 border-white">
                      <Image
                        src={
                          chat.user2?.profileImage ||
                          "https://sefr.lon1.digitaloceanspaces.com/sefr/uploads/messages/files/1770264884749-t0grnc2npkj.png"
                        }
                        alt={user2Name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {user1Name} & {user2Name}
                    </div>
                    {orderId && (
                      <div className="text-[11px] text-gray-400 truncate">
                        Order ID: {orderId}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 truncate">
                      {lastMessage}
                    </div>
                  </div>
                  {chat?.isFlagged && (
                    <IoMdFlag className="w-5 h-5 text-bprimary shrink-0" />
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 rounded-xl flex flex-col bg-white">
        <div
          className={`${
            activeRoom ? "flex" : "hidden"
          } flex flex-col sm:flex-row w-full sm:w-4/5 mx-auto mb-4 sm:mb-6 gap-2 sm:gap-3 px-4 sm:px-0`}
        >
          <button
            disabled={!activeRoom}
            onClick={handleToggleFlagChat}
            className={`w-full px-3 sm:px-6 cursor-pointer py-2 rounded-lg font-medium text-sm sm:text-base transition-all ${
              currentRoom?.isFlagged
                ? "bg-orange-100 text-orange-700 border border-orange-300 hover:bg-orange-200"
                : "bg-blue-50 text-bprimary border border-bprimary hover:bg-bprimary hover:text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {currentRoom?.isFlagged ? "Unflag" : "Flag"}
          </button>
          <button
            disabled={!activeRoom}
            onClick={handleExportPDF}
            className="w-full px-3 sm:px-6 py-2 rounded-lg font-medium text-sm sm:text-base border border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export
          </button>
          <button
            disabled={!activeRoom}
            onClick={() => handleDeleteActiveChat()}
            className="w-full px-3 sm:px-6 py-2 rounded-lg font-medium text-sm sm:text-base bg-red-600 text-white hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!activeRoom ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              Select a chat to view messages
            </div>
          ) : !isReady || messages === undefined ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
              <Ellipsis className="animate-spin" size={40}></Ellipsis>
              <p className="text-sm">Loading messages...</p>
            </div>
          ) : messages?.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              <p>No messages in this room</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const alignment = getMessageAlignment(msg, currentRoom);
              let senderProfile = "";
              let role = "";
              let userName = "";
              let uniqueId = "";
              let phoneNumber = "";
              if (msg?.senderId === currentRoom?.user1?.id) {
                senderProfile = currentRoom?.user1?.profileImage;
                role = currentRoom?.user1?.role;
                userName = currentRoom?.user1?.userName;
                uniqueId = currentRoom?.user1?.uniqueId;
                phoneNumber = currentRoom?.user1?.phoneNumber;
              } else if (msg?.senderId === currentRoom?.user2?.id) {
                senderProfile = currentRoom?.user2?.profileImage;
                role = currentRoom?.user2?.role;
                userName = currentRoom?.user2?.userName;
                uniqueId = currentRoom?.user2?.uniqueId;
                phoneNumber = currentRoom?.user2?.phoneNumber;
              }

              const hasFiles =
                msg?.fileUrl?.filter((f: string) => f && f !== "").length > 0;

              return (
                <div
                  key={index}
                  className={`flex ${alignment} items-end space-x-2`}
                >
                  {alignment === "justify-start" && (
                    // <div className="w-8 h-8 rounded-full overflow-hidden border">
                    //   <img
                    //     src={
                    //       senderProfile ||
                    //       "https://sefr.lon1.digitaloceanspaces.com/sefr/uploads/messages/files/1770264884749-t0grnc2npkj.png"
                    //     }
                    //     alt="user"
                    //     className="object-cover w-full h-full"
                    //   />
                    // </div>
                    <UserDetailsModal
                      userName={userName}
                      role={role}
                      uniqueId={uniqueId}
                      phoneNumber={phoneNumber}
                      profileImage={
                        senderProfile ||
                        "https://sefr.lon1.digitaloceanspaces.com/sefr/uploads/messages/files/1770264884749-t0grnc2npkj.png"
                      }
                    ></UserDetailsModal>
                  )}

                  <div
                    className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                      alignment === "justify-end"
                        ? "bg-bprimary/20 rounded-tr-none"
                        : "bg-gray-100 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    {msg.content && <p>{msg.content}</p>}
                    {hasFiles &&
                      msg.fileUrl
                        .filter((f: string) => f && f !== "")
                        .map((url: string, i: number) => (
                          <FilePreview key={i} url={url} />
                        ))}
                    <div className="text-[10px] mt-1 opacity-70 text-right">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {alignment === "justify-end" && (
                    <UserDetailsModal
                      userName={userName}
                      role={role}
                      uniqueId={uniqueId}
                      phoneNumber={phoneNumber}
                      profileImage={
                        senderProfile ||
                        "https://sefr.lon1.digitaloceanspaces.com/sefr/uploads/messages/files/1770264884749-t0grnc2npkj.png"
                      }
                    ></UserDetailsModal>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

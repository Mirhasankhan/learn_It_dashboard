import { useEffect, useState, useCallback } from "react";

let globalSocket: WebSocket | null = null;

export const useChatSocket = (token: string | null) => {
  const [isReady, setIsReady] = useState(false);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [messagesMap, setMessagesMap] = useState<Record<string, any[]>>({});

  const connect = useCallback(() => {
    if (!token || (globalSocket && globalSocket.readyState === WebSocket.OPEN)) return;

    // const ws = new WebSocket(`ws://localhost:4012?x-token=${token}`);
    const ws = new WebSocket(`ws://72.60.10.234:4012/socket?x-token=${token}`);
    globalSocket = ws;

    ws.onopen = () => {     
      setIsReady(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { type, roomId, messages, message } = data;

        if (!roomId && type !== "member-conversation") return;

        setMessagesMap((prev) => {
          const currentRoomId = roomId;

          if (type === "admin-room-messages") {
            return { ...prev, [currentRoomId]: messages || [] };
          }

          if (type === "member-new-message") {
            const existing = prev[currentRoomId] || [];
            return { ...prev, [currentRoomId]: [...existing, message] };
          }

          return prev;
        });
      } catch (err) {
        console.error("❌ Socket parse error", err);
      }
    };

    ws.onclose = () => {
      setIsReady(false);
      setTimeout(connect, 5000); // Reconnect after 5s
    };
  }, [token]);

  useEffect(() => {
    connect();
    return () => {
      globalSocket?.close();
      globalSocket = null;
    };
  }, [connect]);

  const subscribeToRoom = useCallback((roomId: string) => {
    if (!roomId) return;
    setActiveRoom(roomId);

    if (globalSocket?.readyState === WebSocket.OPEN) {    
      globalSocket.send(JSON.stringify({ type: "admin-subscribe-room", roomId }));
    }
  }, []);

  const currentMessages = activeRoom ? messagesMap[activeRoom] || [] : [];

  return { messages: currentMessages, activeRoom, subscribeToRoom, isReady };
};

import { useEffect, useRef } from "react";

export function useWebSocket(path: string, onMessage: (data: any) => void) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}${path}`;
    
    const connectWebSocket = () => {
      try {
        const socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
          console.log("WebSocket connected");
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            onMessage(data);
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        socket.onclose = () => {
          console.log("WebSocket disconnected, attempting to reconnect...");
          setTimeout(connectWebSocket, 3000); // Reconnect after 3 seconds
        };

        socket.onerror = (error) => {
          console.error("WebSocket error:", error);
        };
      } catch (error) {
        console.error("Failed to create WebSocket connection:", error);
        setTimeout(connectWebSocket, 3000);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [path, onMessage]);

  return wsRef.current;
}

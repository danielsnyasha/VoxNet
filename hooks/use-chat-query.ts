import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket.provider";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) => {
  const { isConnected } = useSocket();
 

  // Define the fetch function within the hook
  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue, // Dynamic query param based on paramKey
        },
      },
      { skipNull: true }
    );

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch messages");
    }
    return res.json();
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [queryKey, paramValue], // Add paramValue to queryKey to ensure unique queries per paramValue
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    initialPageParam: undefined, // Set initialPageParam to start the query
    enabled: isConnected && !!paramValue, // Ensure it only runs when conditions are met
    refetchInterval: isConnected ? 1000 : false, // Refetch every 1000ms if connected
  });

  // You can return the query result here if needed
  return { data, fetchNextPage, hasNextPage, isFetchingNextPage, status };
};

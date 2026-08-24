import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

// Is there currently a network service?
export function useNetworkStatus() {
    const [isOnline, setIsOnline] = useState<boolean | null>(null);
  
    useEffect(() => {
      const eventListener = NetInfo.addEventListener((state) => {
        setIsOnline(state.isConnected);
      });
  
      return eventListener;
    }, []);
  
    return isOnline;
  }
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addNotification } from "./redux/notificationsSlice";
import JsonDrivenDashboard from "./DashboardExample";
import NavigationBar from "./NavigationBar";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission();
    }

    // WebSocket connection
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('Message from server ', message);

        // Dispatch to Redux store
        dispatch(addNotification(message));

        // Send message to service worker
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'SHOW_NOTIFICATION',
            payload: message,
          });
        }
      } catch (error) {
        console.error(
          'Error parsing WebSocket message or sending to service worker:',
          error
        );
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    // Clean up the connection when the component unmounts
    return () => {
      ws.close();
    };
  }, [dispatch]);

  return (
    <>
      <NavigationBar />
      <JsonDrivenDashboard />
    </>
  );
}

export default App;
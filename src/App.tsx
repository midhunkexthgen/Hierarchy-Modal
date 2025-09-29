// import { useEffect, useState } from "react";
import JsonDrivenDashboard from "./DashboardExample";
import NavigationBar from "./NavigationBar";

// interface Notification {
//   title: string;
//   body: string;
// }

function App() {
  // const [notifications, setNotifications] = useState<Notification[]>([]);

  // useEffect(() => {
  //   const ws = new WebSocket("ws://localhost:8080");

  //   ws.onopen = () => {
  //     console.log("connected");
  //   };

  //   ws.onmessage = (event) => {
  //     const notification = JSON.parse(event.data);
  //     setNotifications((prev) => [...prev, notification]);
  //   };

  //   ws.onclose = () => {
  //     console.log("disconnected");
  //   };

  //   return () => {
  //     ws.close();
  //   };
  // }, []);

  return (
    <>
      <NavigationBar />
      <JsonDrivenDashboard />
      {/* <div style={{ position: "fixed", top: "10px", right: "10px", zIndex: 9999 }}>
        {notifications.map((notification, index) => (
          <div key={index} style={{ background: "white", padding: "10px", margin: "10px", borderRadius: "5px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
            <h3>{notification.title}</h3>
            <p>{notification.body}</p>
          </div>
        ))}
      </div> */}
    </>
  );
}

export default App;

import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <>
      {children || <Outlet />}
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            error: "bg-danger-500 text-white",
            success: "bg-success-500 text-white",
            warning: "bg-warning-500 text-white",
            info: "bg-brand-500 text-white",
          },
          duration: 4000,
        }}
      />
    </>
  );
}

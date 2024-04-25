import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

export default function Alert() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return false;
  return <ToastContainer />;
}

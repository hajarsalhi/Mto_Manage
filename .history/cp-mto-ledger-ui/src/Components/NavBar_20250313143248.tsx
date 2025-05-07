import React, { useState } from "react";

const NavBar : React.FC = ()=>{
  const [isOpen, setIsOpen] = useState(false)

  // Current path would normally come from usePathname() in Next.js
  const currentPath = "/dashboard"

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }
  
  return (
    <>
    </>
  );
}

export default NavBar;
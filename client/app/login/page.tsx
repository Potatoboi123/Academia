import React from "react";
import LoginPage from "./components/loginPage";
import PersistLogin from "@/components/PersistLogin";

function page() {
  return (
    <PersistLogin>
      <LoginPage />
    </PersistLogin>
  );
}

export default page;

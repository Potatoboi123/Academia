import React from "react";
import SignupPage from "./components/signupPage";
import PersistLogin from "@/components/PersistLogin";

function page() {
  return (
    <PersistLogin>
      <SignupPage />
    </PersistLogin>
  );
}

export default page;

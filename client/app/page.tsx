// app/page.tsx

import LandingPage from "@/components/landingPage/LandingPage";
import PersistLogin from "@/components/PersistLogin";

export default function Home() {
  return (
    <>
      <PersistLogin>
        <LandingPage />
      </PersistLogin>
    </>
  );
}

import AdminLogin from "./AdminLoginPage";
import PersistLogin from "@/components/PersistLogin";
export default function Page() {
  return (
    <>
      <PersistLogin>
        <AdminLogin />
      </PersistLogin>
    </>
  );
}

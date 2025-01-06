import EventsSection from "@/components/EventCard";
import CoursesSection from "@/components/Course";
import PersistLogin from "@/components/PersistLogin";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
  return (
    <>
      <PersistLogin>
        <ProtectedRoute role="student">
          <CoursesSection />
          <EventsSection />
        </ProtectedRoute>
      </PersistLogin>
    </>
  );
}

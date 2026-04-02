import CompanyName from "./CompanyName";
import Banner from "./Banner";
import Footer from "./Footer";
import CarouselShell from "./carousel/CarouselShell";
import { projects } from "@/lib/projects";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen-dynamic w-full overflow-hidden bg-transparent">
      <div
        className="
          mx-auto flex h-full min-h-screen-dynamic w-full flex-col
          px-4 py-3 gap-3
          md:px-6 md:py-4 md:gap-4
          lg:px-8 lg:py-6 lg:gap-6
        "
      >
        <div className="flex-shrink-0">
          <CompanyName />
        </div>

        <div
          className="
            flex flex-1 items-center justify-center
            min-h-[48vh]
            md:min-h-[52vh]
            lg:min-h-[55vh]
          "
        >
          <CarouselShell projects={projects} />
        </div>

        <div className="flex-shrink-0">
          <Banner />
        </div>

        <div className="flex-shrink-0">
          <Footer />
        </div>
      </div>
    </main>
  );
}

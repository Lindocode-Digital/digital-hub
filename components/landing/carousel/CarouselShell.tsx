import type { Project } from "@/lib/projects";
import CoverFlow from "./CoverFlow";

export default function CarouselShell({ projects }: { projects: Project[] }) {
  return <CoverFlow covers={projects} />;
}

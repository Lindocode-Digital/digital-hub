"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import type { Project } from "@/lib/projects";
import "./ProjectCard.css";

type ProjectCardProps = {
  project: Project;
  active: boolean;
  onClick: () => void;
};

export default function ProjectCard({
  project,
  active,
  onClick,
}: ProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      onClick={() => {
        if (active && project.link) {
          window.location.href = project.link;
        } else {
          onClick();
        }
      }}
      className={clsx(
        "project-card-scene relative h-[clamp(220px,30svh,300px)] w-[clamp(190px,52vw,300px)] cursor-pointer transition-all duration-500 ease-out sm:w-[clamp(210px,30vw,280px)] lg:w-[clamp(220px,28vw,290px)]",
        active ? "scale-100" : "scale-[0.95]",
      )}
    >
      <div
        className={clsx(
          "project-card-face project-card-front overflow-hidden transition-all duration-500",
          active
            ? "project-card-face-visible"
            : "project-card-face-hidden-front",
        )}
      >
        <div className="flex h-full flex-col">
          <div
            className={clsx(
              "project-card-image-wrapper flex items-end justify-center",
              !imageLoaded && "loading",
            )}
          >
            <Image
              src={project.image}
              alt={project.cardTitle}
              fill
              priority={active}
              sizes="(max-width: 639px) 58vw, (max-width: 1023px) 42vw, 360px"
              className={clsx(
                "project-card-image object-cover transition-opacity duration-500",
                imageLoaded ? "opacity-100" : "opacity-0",
              )}
              onLoad={() => setImageLoaded(true)}
            />

            <div className="absolute inset-x-0 bottom-2 z-[3] flex justify-center px-2">
              <span className="project-card-title-pill inline-flex max-w-[90%] truncate rounded-full border border-red-500 bg-white px-3 py-1 text-[clamp(0.72rem,2vw,1rem)] text-black shadow-sm sm:px-4">
                {project.cardTitle}
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between gap-3 p-3 sm:p-4">
            <div className="space-y-1">
              <p className="text-center text-[clamp(0.75rem,1.8vw,1rem)] font-medium leading-snug text-neutral-800">
                {project.description}
              </p>

              {project.cardSubtitle && (
                <p className="text-center font-medium text-[clamp(0.68rem,1.5vw,0.88rem)] text-neutral-500">
                  {project.cardSubtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          "project-card-face project-card-back flex items-center justify-center transition-all duration-500",
          active
            ? "project-card-face-hidden-back"
            : "project-card-face-visible-back",
        )}
      />
    </div>
  );
}

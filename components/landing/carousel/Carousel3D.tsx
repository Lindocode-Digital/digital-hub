"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import clsx from "clsx";
import type { Project } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

function getPose(index: number, activeIndex: number, total: number) {
  const angleStep = total ? 360 / total : 0;
  const currentRotation = -(activeIndex * angleStep);
  const angle = index * angleStep + currentRotation;
  const radians = (Math.PI / 180) * angle;

  // Fixed baseline radius so SSR and hydration match.
  // Let CSS/Tailwind handle responsiveness around it.
  const radius = 260;

  const x = radius * Math.sin(radians);
  let z = radius * Math.cos(radians);

  if (index !== activeIndex) z -= 60;

  const isActive = index === activeIndex;

  return {
    angle,
    x,
    z,
    scale: isActive ? 1 : 0.9,
    opacity: isActive ? 1 : 0.88,
    zIndex: isActive ? 10 : 1,
  };
}

export default function Carousel3D({ projects }: { projects: Project[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  const initialPoses = useMemo(
    () => projects.map((_, index) => getPose(index, 0, projects.length)),
    [projects],
  );

  useEffect(() => {
    itemRefs.current.forEach((item, index) => {
      if (!item) return;

      const pose = getPose(index, activeIndex, projects.length);

      gsap.to(item, {
        x: pose.x,
        z: pose.z,
        rotateY: pose.angle,
        scale: pose.scale,
        opacity: pose.opacity,
        zIndex: pose.zIndex,
        duration: 0.6,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    });
  }, [activeIndex, projects.length]);

  return (
    <section
      className={clsx(
        "relative flex w-full flex-col items-center justify-center perspective-1500",
        "min-h-[50vh] lg:min-h-[55vh]",
      )}
    >
      <div className="relative flex h-[clamp(300px,38vh,460px)] w-[clamp(240px,24vw,320px)] items-center justify-center preserve-3d scale-[0.9] sm:scale-100 lg:scale-105">
        {projects.map((project, index) => {
          const pose = initialPoses[index];

          return (
            <div
              key={project.slug}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              className="absolute preserve-3d"
              style={{
                transform: `translate3d(${pose.x}px, 0px, ${pose.z}px) rotateY(${pose.angle}deg) scale(${pose.scale})`,
                opacity: pose.opacity,
                zIndex: pose.zIndex,
                margin: "10px",
              }}
            >
              <ProjectCard
                project={project}
                active={index === activeIndex}
                onClick={() => setActiveIndex(index)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

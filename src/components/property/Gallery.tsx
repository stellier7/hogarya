"use client";

import Image from "next/image";
import { useState } from "react";
import { Parallax } from "@/components/motion/Parallax";
import type { PropertyImage } from "@/domain/types";

export function Gallery({ images, title }: { images: PropertyImage[]; title: string }) {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];
  if (!current) {
    return <div className="media mx-3 mt-3 grid min-h-[50vh] place-items-center bg-forest text-ivory md:mx-5">Sin fotografías</div>;
  }
  return (
    <div className="px-3 pt-3 md:px-5">
      <div className="media relative min-h-[58vh] bg-forest md:min-h-[72vh]">
        <Parallax strength={88}>
          <Image key={current.src} src={current.src} alt={current.alt || title} fill priority sizes="100vw" className="fade-swap object-cover" />
        </Parallax>
      </div>
      {images.length > 1 ? (
        <div className="mx-auto flex max-w-6xl gap-3 overflow-x-auto py-4" role="tablist" aria-label="Fotografías">
          {images.map((image, imageIndex) => (
            <button
              key={image.src}
              type="button"
              role="tab"
              aria-selected={imageIndex === index}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-full border-2 transition duration-300 ${imageIndex === index ? "border-gold" : "border-transparent opacity-80 hover:opacity-100"}`}
              onClick={() => setIndex(imageIndex)}
            >
              <Image src={image.src} alt="" fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

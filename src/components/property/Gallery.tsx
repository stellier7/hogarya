"use client";

import Image from "next/image";
import { useState } from "react";
import type { PropertyImage } from "@/domain/types";

export function Gallery({ images, title }: { images: PropertyImage[]; title: string }) {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];
  if (!current) {
    return <div className="grid min-h-[50vh] place-items-center bg-forest text-ivory">Sin fotografías</div>;
  }
  return (
    <div>
      <div className="relative min-h-[58vh] bg-forest md:min-h-[72vh]">
        <Image src={current.src} alt={current.alt || title} fill priority sizes="100vw" className="object-cover" />
      </div>
      {images.length > 1 ? (
        <div className="mx-auto flex max-w-6xl gap-3 overflow-x-auto px-5 py-4" role="tablist" aria-label="Fotografías">
          {images.map((image, imageIndex) => (
            <button
              key={image.src}
              type="button"
              role="tab"
              aria-selected={imageIndex === index}
              className={`relative h-20 w-28 shrink-0 overflow-hidden border ${imageIndex === index ? "border-forest" : "border-transparent"}`}
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

import React from "react";
// import image from Next.js
import Image, { StaticImageData } from "next/image";

interface ImageLoaderProps {
  img: StaticImageData;
  alt: string;
  className?: string;
}

const classNames = (...classes: Array<string | undefined>) => {
  return classes.filter(Boolean).join(" ");
};

function ImageLoader({ img, alt, className }: ImageLoaderProps) {
  return (
    <div
      className={classNames("p-2 my-4 flex justify-center w-full", className)}
    >
      <Image
        className="object-cover rounded-lg shadow-lg"
        alt={alt}
        src={img}
      />
    </div>
  );
}

export default ImageLoader;

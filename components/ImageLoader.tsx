import React from "react";
// import image from Next.js
import Image, { StaticImageData } from "next/image";

interface ImageLoaderProps {
  img: StaticImageData;
  alt: string;
}

function ImageLoader({ img, alt }: ImageLoaderProps) {
  return (
    <div className="p-2 my-4 flex justify-center w-full">
      <Image
        className="object-cover rounded-lg shadow-lg"
        alt={alt}
        src={img}
      />
    </div>
  );
}

export default ImageLoader;

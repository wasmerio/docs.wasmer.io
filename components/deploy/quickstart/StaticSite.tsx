import React from "react";
// import image from Next.js
import Image from "next/image";

interface StaticSiteProps {
  image: string;
}

function StaticSite({ image }: StaticSiteProps) {
  return (
    <div className="p-2 my-4 flex justify-center w-full">
      <Image
        className="object-cover rounded-lg shadow-lg"
        alt={"WASIX Explained"}
        src={image}
      />
    </div>
  );
}

export default StaticSite;

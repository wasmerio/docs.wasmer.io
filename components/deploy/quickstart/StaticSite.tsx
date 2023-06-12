import React from "react";
// import image from Next.js
import Image from "next/image";

import staticSiteImg from "@assets/deploy/quickstart/static-site.png";

// import staticSiteImg from "../../../assets/deploy/quickstart/static-site.png";

function StaticSite() {
  return (
    <div className="p-2 my-4 flex justify-center w-full">
      <Image
        className="object-cover rounded-lg shadow-lg"
        alt={"WASIX Explained"}
        src={staticSiteImg}
      />
    </div>
  );
}

export default StaticSite;

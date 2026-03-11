import Image from "next/image";
import React from "react";

const Logo = ({ variant }: { variant: "default" | "icon" }) => {
  return (
    <div className="flex items-center gap-2">
      <Image src="/logo.png" alt="VapeLab" width={40} height={40} />
      {variant == "default" && (
        <span className="text-lg font-bold text-mint glow-text-mint">
          VapeLab
        </span>
      )}
    </div>
  );
};

export default Logo;

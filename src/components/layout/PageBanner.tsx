
import React from "react";

interface PageBannerProps {
  title: string;
  subtitle?: string;
}

const PageBanner = ({ title, subtitle }: PageBannerProps) => {
  return (
    <div className="bg-gradient-to-r from-eventPurple-600 to-eventPurple-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{title}</h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-eventPurple-100">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageBanner;

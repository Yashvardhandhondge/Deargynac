import Link from "next/link";

import BrandLogo from "@/components/shared/BrandLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFF7F9] flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-8">
        <BrandLogo height={48} />
      </div>

      <h1 className="text-8xl lg:text-9xl font-bold text-[#D97894] font-serif opacity-20">
        404
      </h1>

      <h2 className="text-2xl font-bold text-[#3D3438] font-serif mt-4">
        Page Not Found
      </h2>

      <p className="text-gray-500 mt-2 max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>

      <Link
        href="/"
        className="mt-8 bg-[#D97894] text-white rounded-full px-8 py-3 font-semibold hover:bg-[#C45F7E] transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}

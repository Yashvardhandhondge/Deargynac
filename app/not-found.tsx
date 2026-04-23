import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDF8F5] flex flex-col items-center justify-center px-4 text-center">
      <Link href="/" className="flex items-baseline mb-8">
        <span className="font-serif font-bold text-2xl text-[#1A0A12]">Dear</span>
        <span className="font-serif italic text-2xl text-[#C2185B]">Gynac</span>
        <span className="text-[#D4A017] font-bold text-3xl leading-none">.</span>
      </Link>

      <h1 className="text-8xl lg:text-9xl font-bold text-[#C2185B] font-serif opacity-20">
        404
      </h1>

      <h2 className="text-2xl font-bold text-[#1A0A12] font-serif mt-4">
        Page Not Found
      </h2>

      <p className="text-gray-500 mt-2 max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>

      <Link
        href="/"
        className="mt-8 bg-[#C2185B] text-white rounded-full px-8 py-3 font-semibold hover:bg-[#880E4F] transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}

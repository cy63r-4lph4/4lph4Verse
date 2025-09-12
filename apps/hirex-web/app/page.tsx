import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 h-screen bg-gradient-to-b from-purple-900 via-purple-700 to-purple-500 text-white">
      <h1 className="text-5xl font-bold mb-8">Welcome to HireCore</h1>
      <p className="text-lg">Your gateway to the best hiring solutions.</p>
      <Image
        src="/hirex-logo.png"
        alt="HireX Logo"
        width={600}
        height={600}
        className="rounded-lg "
      />
      <h2 className="text-3xl font-semibold ">Get Started</h2>
      <p className="text-md mt-4">
        Driver or Seamstress,{" "}
        <span className="font-bold text-green-500">
          create your CV on chain today
        </span>
      </p>
    </div>
  );
}

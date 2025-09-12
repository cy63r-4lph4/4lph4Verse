import Image from "next/image";

export default function Home() {
  return (
    
    <div className="flex min-h-screen flex-col items-center justify-center p-24 h-screen bg-gradient-to-b from-purple-900 via-purple-700 to-purple-500 text-white">
      <h1 className="text-5xl font-bold mb-8">Welcome to VerseCore</h1>
      <p className="text-lg">The Root of the 4lph4Verse</p>
    
      <h2 className="text-3xl font-semibold ">Get faucet now</h2>
      <a href="/faucet"  className="text-md mt-4 underline text-blue-300">
        https://versecore.xyz/faucet
      </a>
   
      
    </div>
  );
}

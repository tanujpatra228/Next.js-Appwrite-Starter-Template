import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-[100dvh]">
      <span>Visit</span>&nbsp;<Link href="/login" className="underline">Login Page</Link>
    </div>
  );
}

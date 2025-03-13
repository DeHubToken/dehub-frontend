import { redirect } from "next/navigation";
import BuyCryptoForm from "./components/buy-crypto-from";

export default async function Page() {
  redirect("/")
  return (
    <main className="flex h-auto min-h-screen w-full items-start justify-between">
      <div className="flex h-auto min-h-screen w-full flex-col items-start justify-start gap-6 px-6 py-28 sm:gap-10 md:max-w-[75%] md:flex-[0_0_75%]">

        <BuyCryptoForm />
      </div>
    </main>
  );
}

import logo from "@/assets/react.svg";

export default function GlobalLoader() {
  return (
    <div className="bg-muted flex h-screen w-screen flex-col items-center justify-center">
      <div className="mb-15 flex animate-bounce items-center gap-4">
        <img src={logo} alt="logo" className="w-10" />
        <div className="text-2xl font-bold">OKURI</div>
      </div>
    </div>
  );
}

type Props = {
  children: React.ReactNode;
  params: { id: string };
};

export default function StreamInfoLayout({ children }: Props) {
  return (
    <div className="flex h-auto min-h-screen w-full flex-col items-start justify-start xl:flex-row xl:justify-between">
      {children}
    </div>
  );
}

export default function Layout(props: React.PropsWithChildren) {
  return (
    <div className="h-full px-6">
      <h1 className="py-6 text-3xl text-neutral-100">DeHub AI</h1>
      <div className="flex flex-col gap-3 xl:h-[calc(100vh-var(--navbar-height)-8px-120px)] xl:flex-row">
        {props.children}
      </div>
    </div>
  );
}

export default function RsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-none">
        {children}
      </div>
    </div>
  );
}
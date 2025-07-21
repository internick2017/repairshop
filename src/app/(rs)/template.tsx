export default function RsTemplate({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="animate-appear">
          {children}
      </div>
    );
  }
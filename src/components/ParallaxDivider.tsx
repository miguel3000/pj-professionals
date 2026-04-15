export default function ParallaxDivider({
  image,
  height = "h-[45vh]",
  overlay = "from-teal-dark/80 via-teal-dark/40 to-teal-dark/80",
  children,
}: {
  image: string;
  height?: string;
  overlay?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={`relative ${height} overflow-hidden`}
      style={{
        backgroundImage: `url(${image})`,
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${overlay}`} />
      {children && (
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {children}
          </div>
        </div>
      )}
    </section>
  );
}

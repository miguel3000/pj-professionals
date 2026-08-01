export default function PageHero({
  title,
  subtitle,
  badge,
  image,
}: {
  title: string;
  subtitle: string;
  badge?: string;
  image?: string;
}) {
  return (
    <section className="relative pt-8 lg:pt-32 pb-24 overflow-hidden min-h-[50vh] flex items-center">
      {/* Background: gradient or image */}
      {image ? (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${image})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-teal-dark/70 via-teal-dark/50 to-teal-dark/80" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-teal-dark via-teal-medium to-teal-dark" />
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-teal-medium/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-teal-medium/10 blur-3xl" />
        </>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        {badge && (
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-6 backdrop-blur-sm">
            {badge}
          </span>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
          {title}
        </h1>
        <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto drop-shadow-md">
          {subtitle}
        </p>
      </div>
    </section>
  );
}

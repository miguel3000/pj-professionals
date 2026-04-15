export default function SectionBlock({
  id,
  title,
  children,
  gray,
}: {
  id?: string;
  title?: string;
  children: React.ReactNode;
  gray?: boolean;
}) {
  return (
    <section id={id} className={`py-16 sm:py-20 ${gray ? "bg-teal-surface" : "bg-white"}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-2xl sm:text-3xl font-bold text-teal-dark mb-8">
            {title}
          </h2>
        )}
        <div className="prose prose-gray max-w-none prose-headings:text-teal-dark prose-headings:font-semibold prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-teal-dark">
          {children}
        </div>
      </div>
    </section>
  );
}

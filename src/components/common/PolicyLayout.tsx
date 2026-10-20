import Breadcrumb from "@/components/common/Breadcrumb";

export type PolicySection = {
  heading: string;
  body: string[];
};

export default function PolicyLayout({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: PolicySection[];
}) {
  return (
    <>
      <Breadcrumb title={title} items={[{ label: title }]} />

      <section className="relative py-14 md:py-20 overflow-hidden bg-white">
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-brand-muted mb-10">
            Last updated: <span className="font-semibold text-brand-ink">{updated}</span>
          </p>

          <div className="space-y-10">
            {sections.map((s) => (
              <div key={s.heading}>
                <h2 className="font-display font-medium text-brand-ink text-xl md:text-2xl mb-3">
                  {s.heading}
                </h2>
                <div className="space-y-3 text-brand-muted text-[15px] leading-relaxed">
                  {s.body.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

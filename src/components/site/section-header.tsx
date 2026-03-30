type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-7 max-w-3xl">
      <p className="text-xs uppercase tracking-[0.22em] text-brand-400">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-medium tracking-[-0.04em] text-white md:text-4xl">{title}</h1>
      {description ? <p className="mt-3 text-sm leading-7 text-brand-300 md:text-base">{description}</p> : null}
    </div>
  );
}

export function OwnerPageTitle({
  title,
  description,
  badge,
  actions,
}: {
  title: string;
  description: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-extrabold tracking-[-0.02em]">{title}</h1>
          {badge}
        </div>
        <p className="mt-1 text-sm text-ink-muted">{description}</p>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 md:gap-3">{actions}</div>}
    </div>
  );
}

export function OwnerCard({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <section className={`rounded-card border border-line bg-white shadow-card ${className}`}>{children}</section>;
}

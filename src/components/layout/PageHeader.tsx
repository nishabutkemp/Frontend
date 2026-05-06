export function PageHeader({ title, subtitle, aside }: { title: string; subtitle?: string; aside?: React.ReactNode }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {aside}
    </div>
  );
}

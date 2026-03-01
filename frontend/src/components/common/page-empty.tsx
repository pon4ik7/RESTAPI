export function PageEmpty({ title, description }: { title: string; description: string }): JSX.Element {
  return (
    <div className="rounded-xl border border-dashed bg-background/80 p-10 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

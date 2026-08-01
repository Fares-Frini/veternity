export function BookSpine() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-20 -translate-x-1/2">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.05) 32%, rgba(0,0,0,0.16) 47%, rgba(0,0,0,0.16) 53%, rgba(0,0,0,0.05) 68%, transparent 100%)",
        }}
      />
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border" />
    </div>
  );
}

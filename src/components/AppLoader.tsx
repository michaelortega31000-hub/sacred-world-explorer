// Lightweight branded loader shown while auth/profile state resolves.
// Avoids an empty white screen in the embedded preview iframe.
export const AppLoader = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
    <div className="flex flex-col items-center gap-3">
      <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      <p className="text-sm text-muted-foreground">SacredWorld…</p>
    </div>
  </div>
);

export default AppLoader;

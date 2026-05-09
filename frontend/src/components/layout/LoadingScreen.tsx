export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center py-40">
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-border border-t-accent-cyan animate-spin" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-b-accent-magenta animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
      </div>
    </div>
  );
}

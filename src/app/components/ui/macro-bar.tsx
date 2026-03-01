interface MacroBarProps {
  progress: number;
  color: string;
}

export function MacroBar({ progress, color }: MacroBarProps) {
  const clampedProgress = Math.min(progress, 100);

  return (
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${clampedProgress}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
}

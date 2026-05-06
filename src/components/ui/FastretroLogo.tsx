type FastretroLogoProps = {
  compact?: boolean;
  size?: "default" | "small";
};

export function FastretroLogo({ compact = false, size = "default" }: FastretroLogoProps) {
  return (
    <div className={size === "small" ? "fastretro-logo fastretro-logo-small" : "fastretro-logo"}>
      <div className="fastretro-logo-icon">
        <span className="fastretro-logo-letter">F</span>
      </div>
      {!compact && <span className="fastretro-logo-wordmark">Fastretro</span>}
    </div>
  );
}

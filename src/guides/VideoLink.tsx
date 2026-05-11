type VideoLinkProps = {
  title: string;
  url: string;
};

export default function VideoLink({ title, url }: VideoLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        border: '2px solid var(--ink)',
        padding: '8px 12px',
        fontFamily: '"DM Mono", monospace',
        fontSize: 12,
        color: 'var(--ink)',
        textDecoration: 'none',
        background: 'var(--cream)',
        transition: 'color 0.08s, border-color 0.08s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.color = 'var(--teal)';
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--teal)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.color = 'var(--ink)';
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--ink)';
      }}
    >
      <span style={{ color: 'var(--orange)' }}>▶</span>
      <span style={{ flex: 1 }}>{title}</span>
      <span style={{ fontSize: 10, opacity: 0.5 }}>YT</span>
    </a>
  );
}

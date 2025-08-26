type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: string };

export default function Button({
  href,
  children,
  className = "",
  ...rest
}: Props) {
  const cn =
    "inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 " +
    className;

  if (href) {
    return (
      <a href={href} className={cn}>
        {children}
      </a>
    );
  }

  return (
    <button className={cn} {...rest}>
      {children}
    </button>
  );
}

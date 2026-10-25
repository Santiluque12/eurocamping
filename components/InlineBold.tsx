/** Muestra en negrita los fragmentos escritos entre **dobles asteriscos**. */
export default function InlineBold({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split("**").map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className={className}>
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </>
  );
}

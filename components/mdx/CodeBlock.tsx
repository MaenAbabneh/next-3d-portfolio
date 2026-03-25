import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function CodeBlock({
  className,
  children,
}: {
  className?: string;
  children: string | string[];
}) {
  // استخراج اللغة من className مثل "language-js"
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : undefined;

  return (
    <div className="my-6 bg-base-dark-BG rounded-2xl overflow-hidden shadow-md">
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          background: "transparent",
          fontSize: "1em",
          margin: 0,
          padding: "1.2em",
        }}
        showLineNumbers
      >
        {typeof children === "string"
          ? children.trim()
          : Array.isArray(children)
            ? children.join("")
            : (children ?? "")}
      </SyntaxHighlighter>
    </div>
  );
}

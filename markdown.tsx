import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-semibold text-gray-900 mb-3 mt-6">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4 flex items-center">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="text-gray-700 mb-3 leading-relaxed">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="space-y-2 mb-4">{children}</ul>
        ),
        li: ({ children }) => {
          const content = String(children);
          
          // Check if this is an emoji-prefixed activity item
          if (content.includes('✈️')) {
            return (
              <li className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <span className="text-lg">✈️</span>
                <div className="text-gray-700">{content.replace('✈️', '').trim()}</div>
              </li>
            );
          } else if (content.includes('🏨')) {
            return (
              <li className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <span className="text-lg">🏨</span>
                <div className="text-gray-700">{content.replace('🏨', '').trim()}</div>
              </li>
            );
          } else if (content.includes('😋')) {
            return (
              <li className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                <span className="text-lg">😋</span>
                <div className="text-gray-700">{content.replace('😋', '').trim()}</div>
              </li>
            );
          } else if (content.includes('🏛️')) {
            return (
              <li className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                <span className="text-lg">🏛️</span>
                <div className="text-gray-700">{content.replace('🏛️', '').trim()}</div>
              </li>
            );
          }
          
          return <li className="text-gray-700">{children}</li>;
        },
        strong: ({ children }) => (
          <strong className="font-semibold text-gray-900">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-gray-600">{children}</em>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

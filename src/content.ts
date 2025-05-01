import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import createDOMPurify from "dompurify";

// Node.js用のDOMPurifyを作成
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window as unknown as Window & typeof globalThis);

export async function extractSanitizedMainContent(url: string): Promise<{
  title: string;
  content: string;
} | null> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Fetch failed with status: ${response.status}`);
    }

    const html = await response.text();

    const dom = new JSDOM(html, { url });
    const document = dom.window.document;

    const reader = new Readability(document);
    const article = reader.parse();

    if (!article) return null;

    const sanitizedHTML = article.content ? DOMPurify.sanitize(article.content) : '';

    return {
      title: article.title || '',
      content: sanitizedHTML,
    };
  } catch (error) {
    console.error("Failed to extract content:", error);
    return null;
  }
}


(async () => {
  const result = await extractSanitizedMainContent('https://kk.org/thetechnium/the-singularity');

  if (result) {
    const { title, content } = result;
    console.log('title', title);
    console.log('content', content);
  } else {
    console.log('Failed to extract content');
  }
})();

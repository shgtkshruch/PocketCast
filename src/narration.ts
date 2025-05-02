import "dotenv/config";
import { OpenAI } from "openai";

import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePodcastScript(
  title: string,
  content: string,
): Promise<string> {
  const prompt = `
  あなたは優秀な放送作家です。以下のブログ・ニュース記事の本文をもとに、ラジオMCが読み上げる台本を作成してください、

【設定】
 ラジオは楽しい雰囲気で、スピーカーは日本のFMラジオのような喋り方をします。
 ラジオのMCは1人で、名前は「サラ」です。
 サラは気さくで陽気な人物です。口調は優しく丁寧で、フレンドリーです。
 記事の紹介、内容の解説、この記事に登場した一般的なソフトウェアエンジニアにとって難しめな概念や用語があればその補足解説、最後にMCなりの視点での感想を含めてください。

【目的】
耳で聞いて理解しやすい、自然で流れるような語り口のナレーション台本を生成してください。

【制約】
- 書き言葉ではなく、話し言葉にしてください。
- イントロ（導入） → 本文の要点 → クロージング の構成にしてください。
- 長すぎず（3〜5分程度）、要点を押さえてください。
- 単調にならないように、聞き手に語りかける調子を取り入れてください。
- 聞き手が内容を理解しやすいよう工夫してください
- 生成する文章はそのまま読み上げられるので不要な記号文字などは含まないでください。
- 難しい表現や漢字には適度にルビ（ふりがな）を付けてください（任意）。

# 出力形式:
- 完成されたナレーション台本
- 口語調、日本語
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: prompt},
      { role: "user", content: `以下の記事「${title}」をラジオの台本形式に変換してください:\n\n${content}` },
    ],
    temperature: 0.8,
    max_tokens: 1500,
  });

  return response.choices[0].message.content || "";
}

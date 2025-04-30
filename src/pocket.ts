import "dotenv/config";

type PocketRetrieveResponse = {
  status: number;
  list: {
    [item_id: string]: {
      item_id: string;
      resolved_title: string;
      resolved_url: string;
      excerpt: string;
      is_article: string;
      has_video: string;
      word_count: string;
      lang: string;
    };
  };
};

type PocketItem = {
  item_id: number;
  title: string;
  url: string;
  lang: string;
};

async function fetchPocketItems({
  consumerKey,
  accessToken,
  count = 10,
  detailType = "simple",
}: {
  consumerKey: string;
  accessToken: string;
  count?: number;
  detailType?: "simple" | "complete";
}): Promise<PocketItem[]> {
  const url = "https://getpocket.com/v3/get";
  const body = {
    consumer_key: consumerKey,
    access_token: accessToken,
    count,
    detailType,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "X-Accept": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Pocket API request failed: ${response.statusText}`);
  }

  const data = (await response.json()) as PocketRetrieveResponse;

  const list = Object.values(data.list).map((item) => ({
    item_id: Number(item.item_id),
    title: item.resolved_title,
    url: item.resolved_url,
    lang: item.lang,
  }));

  return list;
}

(async () => {
  try {
    const items = await fetchPocketItems({
      consumerKey: process.env.POCKET_CONSUMER_KEY || "YOUR_CONSUMER_KEY",
      accessToken: process.env.POCKET_ACCESS_TOKEN || "YOUR_ACCESS_TOKEN",
      count: 30,
      detailType: "simple",
    });

    console.log("取得した記事:", items);
  } catch (err) {
    console.error("エラー:", err);
  }
})();

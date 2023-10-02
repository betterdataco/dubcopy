import { allBlogPosts, allChangelogPosts } from "contentlayer/generated";

export async function GET() {
  return new Response(
    `<?xml version="1.0" encoding="utf-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
        <title>7qr News</title>
        <subtitle>7qr's Blog and Changelog</subtitle>
        <link href="https://7qr.codes/atom" rel="self"/>
        <link href="https://7qr.codes/"/>
        <updated>${new Date().toISOString()}</updated>
        <id>https://7qr.codes/</id>${[...allBlogPosts, ...allChangelogPosts]
          .sort((a, b) => b?.publishedAt.localeCompare(a?.publishedAt))
          .map((post) => {
            return `
        <entry>
            <id>https://7qr.codes/${
              post.type === "BlogPost" ? "blog" : "changelog"
            }/${post?.slug}</id>
            <title>${post?.title}</title>
            <link href="https://7qr.codes/${
              post.type === "BlogPost" ? "blog" : "changelog"
            }/${post?.slug}"/>
            <updated>${post?.publishedAt}</updated>
            <author><name>${post.author}</name></author>
        </entry>`;
          })
          .join("")}
    </feed>`,
    {
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
      },
    },
  );
}
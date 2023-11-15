import { NextRequest, NextResponse } from "next/server";

import fetch from "node-fetch";
const cheerio = require("cheerio");

async function getWebsiteMetadata(url: string) {
  try {
    // Fetch the HTML content of the website
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);

    const title = $("head title").text();
    const poster = $('meta[property="og:image"]').attr("content");

    return {
      title,
      poster,
    };
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  console.log("body", body);

  if (!body.url) {
    return NextResponse.json(
      {
        error: "No url given",
      },
      {
        status: 400,
      }
    );
  }

  return NextResponse.json(await getWebsiteMetadata(body.url));
}

import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile } from "node:fs/promises";

const font = await readFile("./public/fonts/Inter-SemiBold.ttf");

export async function GET() {
  const svg = await satori(
    {
      type: "div",
      props: {
        style: { display: "flex", width: "100%", height: "100%", background: "#0a0a0a", color: "#fafafa", padding: 80, fontSize: 64, fontFamily: "Inter" },
        children: "Janis Schubert",
      },
    },
    { width: 1200, height: 630, fonts: [{ name: "Inter", data: font, weight: 600, style: "normal" }] },
  );
  const png = new Resvg(svg).render().asPng();
  return new Response(png, { headers: { "Content-Type": "image/png" } });
}

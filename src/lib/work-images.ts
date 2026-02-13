import imageData from "../../data/work-images.json";

const imageMap: Record<string, string> = {};

const images = (imageData as { images: Record<string, string> }).images;
for (const title of Object.keys(images)) {
  if (images[title]) {
    imageMap[title] = images[title];
  }
}

export function getWorkImage(title: string): string {
  return imageMap[title] ?? "";
}

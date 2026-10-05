import { renderSocialImage, socialPages } from "@/lib/social-image";

export const alt = socialPages.home.alt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderSocialImage("home");
}

import HomePage from "@/components/HomePage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/");

export default function MainPage() {
  return <HomePage />;
}

import { redirect } from "next/navigation";

export default function ProviderSettingsRedirectPage() {
  redirect("/profile/settings");
}

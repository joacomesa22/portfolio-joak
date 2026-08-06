/**
 * Single source of truth for contact details.
 *
 * `icon` matches a <symbol id="icon-{icon}"> in IconSprite.astro, which Layout
 * renders once per page — so any component can drop a <use> without shipping
 * its own copy of the paths.
 */
export interface Social {
  label: string;
  handle: string;
  href: string;
  icon: string;
}

export const EMAIL = "joacomesa@gmail.com";
export const LINKEDIN = "https://www.linkedin.com/in/joaquinmesa22/";
export const RESUME = "/resume.pdf";

export const SOCIALS: Social[] = [
  {
    label: "Instagram",
    handle: "@joacoo.dev",
    href: "https://www.instagram.com/joacoo.dev/",
    icon: "instagram",
  },
  {
    label: "TikTok",
    handle: "@joacoo.dev",
    href: "https://www.tiktok.com/@joacoo.dev",
    icon: "tiktok",
  },
  {
    label: "Behance",
    handle: "joacomesa1",
    href: "https://www.behance.net/joacomesa1",
    icon: "behance",
  },
  {
    label: "GitHub",
    handle: "joacomesa22",
    href: "https://github.com/joacomesa22",
    icon: "github",
  },
];

/** The two platforms the videos live on — featured on /about. */
export const VIDEO_SOCIALS = SOCIALS.filter((s) =>
  ["instagram", "tiktok"].includes(s.icon),
);

export type AboutContributor = { name: string; description: string };
export type AboutSocialLink = { href: string; icon: string };

export type AboutStoreLink = { href: string; label: string };

export type AboutData = {
  about: string[];
  contributors: AboutContributor[];
  footer: {
    socialsIntro: string;
    socialLinks: AboutSocialLink[];
  };
  getInTouch?: {
    intro: string;
    emailAddress: string;
    emailText: string;
  };
  review?: {
    introLines: string[];
    links: {
      appStore: AboutStoreLink;
      googlePlay: AboutStoreLink;
    };
  };
  copyrightFooter?: string;
};

export const EMPTY_ABOUT_DATA: AboutData = {
  about: [""],
  contributors: [],
  footer: {
    socialsIntro: "",
    socialLinks: [],
  },
  getInTouch: {
    intro: "",
    emailAddress: "mailto:",
    emailText: "",
  },
  review: {
    introLines: [""],
    links: {
      appStore: { href: "", label: "" },
      googlePlay: { href: "", label: "" },
    },
  },
  copyrightFooter: "",
};


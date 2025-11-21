"use client";

import { useQuery } from "@tanstack/react-query";
import { getEnsAvatar, getEnsName, getEnsText } from "viem/actions";
import { normalize } from "viem/ens";
import { useAccount } from "wagmi";
import { mainnetEnsClient } from "@/app/lib/ensClient";

type SocialLink = {
  key: string;
  label: string;
  icon: string;
  url: string;
  display: string;
};

type EnsProfile = {
  name: string | null;
  avatar?: string;
  headerImage?: string;
  description?: string;
  socials: SocialLink[];
};

const SOCIAL_LINKS: Array<{
  key: string;
  label: string;
  icon: string;
  build: (raw: string) => Pick<SocialLink, "url" | "display"> | null;
}> = [
  {
    key: "url",
    label: "Website",
    icon: "🌐",
    build: (raw) => {
      const value = raw.trim();
      if (!value) return null;
      const url = value.startsWith("http") ? value : `https://${value}`;
      return {
        url,
        display: url.replace(/^https?:\/\//, "").replace(/^www\./, ""),
      };
    },
  },
  {
    key: "com.twitter",
    label: "Twitter",
    icon: "🐦",
    build: (raw) => {
      const handle = raw.replace(/^@/, "").trim();
      if (!handle) return null;
      return { url: `https://x.com/${handle}`, display: `@${handle}` };
    },
  },
  {
    key: "com.github",
    label: "GitHub",
    icon: "🐙",
    build: (raw) => {
      const handle = raw.replace(/^@/, "").trim();
      if (!handle) return null;
      return { url: `https://github.com/${handle}`, display: `@${handle}` };
    },
  },
  {
    key: "com.farcaster",
    label: "Farcaster",
    icon: "✨",
    build: (raw) => {
      const handle = raw.replace(/^@/, "").trim();
      if (!handle) return null;
      return { url: `https://warpcast.com/${handle}`, display: `@${handle}` };
    },
  },
  {
    key: "com.discord",
    label: "Discord",
    icon: "💬",
    build: (raw) => {
      const value = raw.trim();
      if (!value) return null;
      return { url: value, display: value };
    },
  },
  {
    key: "com.telegram",
    label: "Telegram",
    icon: "📨",
    build: (raw) => {
      const handle = raw.replace(/^@/, "").trim();
      if (!handle) return null;
      return { url: `https://t.me/${handle}`, display: `@${handle}` };
    },
  },
  {
    key: "com.instagram",
    label: "Instagram",
    icon: "📸",
    build: (raw) => {
      const handle = raw.replace(/^@/, "").trim();
      if (!handle) return null;
      return { url: `https://instagram.com/${handle}`, display: `@${handle}` };
    },
  },
];

const imageFrom = (value?: string | null) => {
  if (!value) return undefined;
  return value.startsWith("ipfs://")
    ? `https://ipfs.io/ipfs/${value.slice("ipfs://".length)}`
    : value;
};

const fetchEnsProfile = async (address: `0x${string}`): Promise<EnsProfile> => {
  const name = await getEnsName(mainnetEnsClient, { address });
  if (!name) {
    return { name: null, socials: [] };
  }

  const normalized = normalize(name);

  const [avatar, header, banner, cover, description, socials] =
    await Promise.all([
      getEnsAvatar(mainnetEnsClient, { name: normalized }).catch(() => null),
      getEnsText(mainnetEnsClient, { name: normalized, key: "header" }).catch(
        () => null,
      ),
      getEnsText(mainnetEnsClient, {
        name: normalized,
        key: "org.ens.profile.banner",
      }).catch(() => null),
      getEnsText(mainnetEnsClient, { name: normalized, key: "cover" }).catch(
        () => null,
      ),
      getEnsText(mainnetEnsClient, {
        name: normalized,
        key: "description",
      }).catch(() => null),
      Promise.all(
        SOCIAL_LINKS.map(async (social) => {
          const value = await getEnsText(mainnetEnsClient, {
            name: normalized,
            key: social.key,
          }).catch(() => null);
          if (!value) return null;
          const built = social.build(value);
          return built ? { ...social, ...built } : null;
        }),
      ),
    ]);

  return {
    name,
    avatar: imageFrom(avatar),
    headerImage: imageFrom(banner ?? cover ?? header),
    description: description ?? undefined,
    socials: (socials.filter(Boolean) as SocialLink[]) ?? [],
  };
};

const shortenAddress = (address?: string) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

export function ENSProfile() {
  const { address, isConnected } = useAccount();

  const { data: profile, isLoading } = useQuery<EnsProfile>({
    queryKey: ["ens-profile", address],
    enabled: isConnected && !!address,
    queryFn: () => fetchEnsProfile(address as `0x${string}`),
    staleTime: 5 * 60 * 1000,
  });

  if (!isConnected || !address) {
    return (
      <div className="card bg-base-200 shadow-xl border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">✨ ENS Profile</h2>
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Please connect your wallet to view your ENS profile.</span>
          </div>
        </div>
      </div>
    );
  }

  const headerImage = profile?.headerImage;
  const avatar = profile?.avatar;

  return (
    <div className="card bg-base-200 shadow-xl border border-base-300 overflow-hidden">
      {headerImage ? (
        <img
          src={headerImage}
          alt="ENS header"
          className="h-36 w-full object-cover"
        />
      ) : (
        <div className="h-24 w-full bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30" />
      )}

      <div className="card-body pt-6">
        {isLoading || !profile ? (
          <div className="flex flex-col items-center py-10 gap-4">
            <span className="loading loading-spinner loading-lg text-primary" />
            <p className="text-sm opacity-70">Loading ENS profile...</p>
          </div>
        ) : !profile.name ? (
          <div className="alert alert-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>
              This address does not currently have an ENS name. You can set one
              at app.ens.domains.
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="w-20 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 overflow-hidden bg-base-300">
                    {avatar ? (
                      <img src={avatar} alt="ENS avatar" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl">
                        ✨
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{profile.name}</h2>
                  <p className="text-sm opacity-70 font-mono">
                    {shortenAddress(address)}
                  </p>
                </div>
              </div>
            </div>

            {profile.description && (
              <p className="leading-relaxed text-base opacity-90">
                {profile.description}
              </p>
            )}

            {profile.socials.length > 0 && (
              <div className="border-t border-base-300 pt-4">
                <h3 className="font-semibold uppercase text-xs tracking-widest mb-3 opacity-70">
                  Social Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {profile.socials.map((social) => (
                    <a
                      key={social.key}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-lg border border-base-300 bg-base-100/60 px-4 py-3 transition hover:border-primary hover:bg-primary/10"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{social.icon}</span>
                        <div>
                          <div className="font-semibold text-base">
                            {social.label}
                          </div>
                          <div className="text-xs font-mono opacity-70 truncate group-hover:text-primary">
                            {social.display}
                          </div>
                        </div>
                      </div>
                      <span className="text-lg opacity-50 group-hover:opacity-100">
                        &rarr;
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type AppleLookupResponse = {
  resultCount: number;
  results: {
    version?: string;
    trackViewUrl?: string;
    bundleId?: string;
    currentVersionReleaseDate?: string;
  }[];
};

function safeReadJsonFile<T>(filePath: string): T | null {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function readDevVersionFromRootPackageJson(): string | null {
  const packageJsonPath = path.join(process.cwd(), "..", "package.json");
  const pkg = safeReadJsonFile<{ version?: unknown }>(packageJsonPath);
  return typeof pkg?.version === "string" ? pkg.version : null;
}

function readIosBundleIdFromRootAppJson(): string | null {
  const appJsonPath = path.join(process.cwd(), "..", "app.json");
  const appJson = safeReadJsonFile<{
    expo?: {
      ios?: {
        bundleIdentifier?: unknown;
      };
    };
  }>(appJsonPath);

  const bundleId = appJson?.expo?.ios?.bundleIdentifier;
  return typeof bundleId === "string" ? bundleId : null;
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      // Ensure this request can be cached by Next.js when applicable.
      next: { revalidate: 300 },
    });
  } finally {
    clearTimeout(id);
  }
}

async function fetchAppStoreVersion(params: {
  bundleId: string;
  country: string;
}): Promise<{ version: string | null; trackViewUrl: string | null }>{
  const { bundleId, country } = params;
  const lookupUrl = `https://itunes.apple.com/lookup?bundleId=${encodeURIComponent(
    bundleId
  )}&country=${encodeURIComponent(country)}`;

  try {
    const res = await fetchWithTimeout(lookupUrl, 8000);
    if (!res.ok) return { version: null, trackViewUrl: null };

    const data = (await res.json()) as AppleLookupResponse;
    const first = Array.isArray(data.results) ? data.results[0] : undefined;
    const version = typeof first?.version === "string" ? first.version : null;
    const trackViewUrl = typeof first?.trackViewUrl === "string" ? first.trackViewUrl : null;
    return { version, trackViewUrl };
  } catch {
    return { version: null, trackViewUrl: null };
  }
}

export async function GET() {
  const devVersion = readDevVersionFromRootPackageJson();

  const country = (process.env.IOS_ITUNES_COUNTRY || "us").toLowerCase();
  const bundleId = process.env.IOS_BUNDLE_ID || readIosBundleIdFromRootAppJson();

  const prod = bundleId
    ? await fetchAppStoreVersion({ bundleId, country })
    : { version: null, trackViewUrl: null };

  return NextResponse.json(
    {
      devVersion,
      prodVersion: prod.version,
      appStoreUrl: prod.trackViewUrl,
      bundleId,
      country,
      fetchedAt: new Date().toISOString(),
    },
    {
      headers: {
        // Helps keep the dashboard snappy and avoids hammering iTunes Lookup.
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}


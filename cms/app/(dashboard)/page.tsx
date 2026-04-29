"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import { useDuaManagement } from "../context/DuaManagementContext";

interface Stats {
  totalDuas: number;
  duasWithoutAudio: number;
  duasWithAudio: number;
  totalCategories: number;
  totalSubcategories: number;
  duasFileSize: number;
  categoriesFileSize: number;
  audioFilesSize: number;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { downloadDuas, downloadCategories } = useDuaManagement();

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        if (!res.ok) {
          setError("Unable to load statistics");
          return;
        }
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError("Unable to load statistics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const audioPercentage = stats
    ? Math.round((stats.duasWithAudio / stats.totalDuas) * 100) || 0
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-6">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Overview of your Manasik content management system
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-xl border border-border bg-card"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <p className="text-destructive">{error}</p>
          </div>
        ) : stats ? (
          <>
            {/* Main Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Total Duas */}
              <Link
                href="/app"
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Duas
                    </p>
                    <p className="mt-2 text-4xl font-bold text-foreground tracking-tight">
                      {stats.totalDuas.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-3">
                    <BookIcon className="h-6 w-6 text-primary"/>
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  View all duas
                  <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                    &rarr;
                  </span>
                </p>
              </Link>

              {/* Audio Coverage */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Audio Coverage
                    </p>
                    <p className="mt-2 text-4xl font-bold text-foreground tracking-tight">
                      {audioPercentage}%
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/10 p-3">
                    <AudioIcon className="h-6 w-6 text-accent"/>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>{stats.duasWithAudio} with audio</span>
                    <span>{stats.duasWithoutAudio} without</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                      style={{width: `${audioPercentage}%`}}
                    />
                  </div>
                </div>
              </div>

              {/* Duas Without Audio - Warning Card */}
              <div className={`rounded-xl border p-6 ${
                stats.duasWithoutAudio > 0
                  ? "border-amber-500/30 bg-amber-500/5"
                  : "border-border bg-card"
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Duas Without Audio
                    </p>
                    <p className={`mt-2 text-4xl font-bold tracking-tight ${
                      stats.duasWithoutAudio > 0 ? "text-amber-600" : "text-foreground"
                    }`}>
                      {stats.duasWithoutAudio.toLocaleString()}
                    </p>
                  </div>
                  <div className={`rounded-lg p-3 ${
                    stats.duasWithoutAudio > 0 ? "bg-amber-500/10" : "bg-muted"
                  }`}>
                    <AudioOffIcon className={`h-6 w-6 ${
                      stats.duasWithoutAudio > 0 ? "text-amber-600" : "text-muted-foreground"
                    }`}/>
                  </div>
                </div>
                {stats.duasWithoutAudio > 0 && (
                  <p className="mt-4 text-xs text-amber-600">
                    Consider adding audio recordings
                  </p>
                )}
              </div>

              {/* Total Categories */}
              <Link
                href="/app/categories"
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Categories
                    </p>
                    <p className="mt-2 text-4xl font-bold text-foreground tracking-tight">
                      {stats.totalCategories.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-secondary p-3">
                    <FolderIcon className="h-6 w-6 text-secondary-foreground"/>
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  Manage categories
                  <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                    &rarr;
                  </span>
                </p>
              </Link>

              {/* Total Subcategories */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Subcategories
                    </p>
                    <p className="mt-2 text-4xl font-bold text-foreground tracking-tight">
                      {stats.totalSubcategories.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <SubfolderIcon className="h-6 w-6 text-muted-foreground"/>
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Avg {(stats.totalSubcategories / stats.totalCategories || 0).toFixed(1)} per category
                </p>
              </div>

              {/* File Sizes */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Data Files
                    </p>
                    <p className="mt-2 text-4xl font-bold text-foreground tracking-tight">
                      {formatFileSize(stats.duasFileSize + stats.categoriesFileSize)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <FileIcon className="h-6 w-6 text-muted-foreground"/>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">duas.json</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {formatFileSize(stats.duasFileSize)}
                      </span>
                      <button
                        onClick={() => downloadDuas()}
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title="Download duas.json"
                      >
                        <DownloadIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">categories.json</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {formatFileSize(stats.categoriesFileSize)}
                      </span>
                      <button
                        onClick={() => downloadCategories()}
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title="Download categories.json"
                      >
                        <DownloadIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Audio Library Size */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Audio Library
                    </p>
                    <p className="mt-2 text-4xl font-bold text-foreground tracking-tight">
                      {formatFileSize(stats.audioFilesSize)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/10 p-3">
                    <MusicIcon className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Total size of all .mp3 files in <code className="bg-muted px-1 rounded">assets/audio</code>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Quick Actions
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                  href="/app"
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:bg-primary/5"
                >
                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <PlusIcon className="h-5 w-5 text-primary"/>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Add New Dua</p>
                    <p className="text-xs text-muted-foreground">
                      Create a new prayer
                    </p>
                  </div>
                </Link>

                <Link
                  href="/app/categories"
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:bg-primary/5"
                >
                  <div className="rounded-lg bg-accent/10 p-2.5">
                    <FolderPlusIcon className="h-5 w-5 text-accent"/>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Manage Categories
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Organize content
                    </p>
                  </div>
                </Link>

                <Link
                  href="/router"
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:bg-primary/5"
                >
                  <div className="rounded-lg bg-secondary p-2.5">
                    <RouterIcon className="h-5 w-5 text-secondary-foreground"/>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Router</p>
                    <p className="text-xs text-muted-foreground">Coming soon</p>
                  </div>
                </Link>

                <Link
                  href="/passport"
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:bg-primary/5"
                >
                  <div className="rounded-lg bg-muted p-2.5">
                    <PassportIcon className="h-5 w-5 text-muted-foreground"/>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Passport</p>
                    <p className="text-xs text-muted-foreground">Coming soon</p>
                  </div>
                </Link>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function DownloadIcon({className}: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
    </svg>
  );
}

// Icons
function BookIcon({className}: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
    </svg>
  );
}

function AudioIcon({className}: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
    </svg>
  );
}

function AudioOffIcon({className}: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>
    </svg>
  );
}

function FolderIcon({className}: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
    </svg>
  );
}

function SubfolderIcon({className}: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14h8"/>
    </svg>
  );
}

function FileIcon({className}: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
    </svg>
  );
}

function PlusIcon({className}: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
    </svg>
  );
}

function FolderPlusIcon({className}: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    </svg>
  );
}

function RouterIcon({className}: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
      <path d="M6 22V14a2 2 0 012-2h8a2 2 0 012 2v8"/>
      <path d="M6 14V2h4v4h4V2h4v12"/>
    </svg>
  );
}

function PassportIcon({className}: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"/>
      <circle cx="12" cy="10" r="3"/>
      <path d="M8 17h8"/>
    </svg>
  );
}

function MusicIcon({className}: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19V6l12-2v13"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19a2 2 0 11-4 0 2 2 0 014 0zm12-2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}


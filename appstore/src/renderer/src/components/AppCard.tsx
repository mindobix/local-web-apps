import React from 'react'
import type { AppDef, BackupRecord } from '../types'

interface Props {
  app: AppDef
  installed: boolean
  serverPort?: number
  isFavorite: boolean
  backupFolder?: string
  lastBackup?: BackupRecord
  onClone: () => void
  onLaunch: () => void
  onStartServer: () => void
  onStopServer: () => void
  onOpenRepo: () => void
  onToggleFavorite: () => void
  onSetBackupFolder: () => void
  onOpenBackupFolder: () => void
  cloning?: boolean
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9" />
      <polyline points="10 1 15 1 15 6" />
      <line x1="15" y1="1" x2="7" y2="9" />
    </svg>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill={filled ? '#f472b6' : 'none'} stroke={filled ? '#f472b6' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 13.5S1.5 9.5 1.5 5.5A3.5 3.5 0 0 1 8 3.664 3.5 3.5 0 0 1 14.5 5.5C14.5 9.5 8 13.5 8 13.5z" />
    </svg>
  )
}

function BackupFolderIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill={active ? '#f59e0b' : 'none'} stroke={active ? '#f59e0b' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 5A1.5 1.5 0 0 1 3 3.5H6L7.5 5H13A1.5 1.5 0 0 1 14.5 6.5V12A1.5 1.5 0 0 1 13 13.5H3A1.5 1.5 0 0 1 1.5 12V5Z" />
      {active
        ? <polyline points="5.5 9 7 10.5 10.5 7" strokeWidth="1.5" />
        : <><line x1="8" y1="7" x2="8" y2="10.5" /><polyline points="6.5 9 8 10.5 9.5 9" /></>
      }
    </svg>
  )
}

function FolderOpenIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 5A1.5 1.5 0 0 1 3 3.5H6L7.5 5H13A1.5 1.5 0 0 1 14.5 6.5v.5H3L1.5 12V5Z" />
      <path d="M1.5 7H14L12.5 13.5h-11L1.5 7Z" />
    </svg>
  )
}

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function AppCard({
  app, installed, serverPort, isFavorite, backupFolder, lastBackup,
  onClone, onLaunch, onStartServer, onStopServer, onOpenRepo,
  onToggleFavorite, onSetBackupFolder, onOpenBackupFolder, cloning
}: Props) {
  const isServer = app.startType === 'python' || app.startType === 'npm'
  const serverRunning = serverPort !== undefined

  return (
    <div
      className="app-card relative bg-[#1a1a2e] border border-white/[0.08] rounded-2xl p-5 flex flex-col gap-3 hover:border-white/[0.15]"
      style={{ boxShadow: installed ? `0 0 20px ${app.bg.replace('.15', '.08')}` : undefined }}
    >
      {/* Top row: icon + badges */}
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: app.bg }}
        >
          {app.icon}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Installed ring */}
          <div className="relative w-7 h-7">
            <svg width="28" height="28" viewBox="0 0 28 28">
              <circle cx="14" cy="14" r="10" fill="none" stroke="#22223b" strokeWidth="2.5" />
              {installed && (
                <circle cx="14" cy="14" r="10" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="62.8 62.8" transform="rotate(-90 14 14)" />
              )}
            </svg>
            {installed && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[9px] text-[#22c55e] font-bold">✓</span>
              </div>
            )}
          </div>

          {/* Favorite */}
          <button
            onClick={onToggleFavorite}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ color: isFavorite ? '#f472b6' : '#4a5568' }}
          >
            <HeartIcon filled={isFavorite} />
          </button>

          {/* Backup folder — only if app declares a backupPattern */}
          {app.backupPattern && (
            <button
              onClick={onSetBackupFolder}
              title={backupFolder ? `Backup folder: ${backupFolder}` : 'Set backup folder'}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
              style={{ color: backupFolder ? '#f59e0b' : '#4a5568' }}
            >
              <BackupFolderIcon active={!!backupFolder} />
            </button>
          )}

          {/* GitHub link */}
          <button
            onClick={onOpenRepo}
            title="View on GitHub"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#4a5568] hover:text-white hover:bg-white/10 transition-colors"
          >
            <GitHubIcon />
          </button>

          {/* Launch in browser (static apps only, when installed) */}
          {installed && !isServer && (
            <button
              onClick={onLaunch}
              title="Open in browser (file://)"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#4a5568] hover:text-[#5b5ef4] hover:bg-white/10 transition-colors"
            >
              <ExternalLinkIcon />
            </button>
          )}
        </div>
      </div>

      {/* App name + category */}
      <div>
        <div className="font-semibold text-white text-[15px] leading-tight">{app.displayName}</div>
        <div className="text-xs mt-0.5" style={{ color: app.color }}>{app.category}</div>
      </div>

      {/* Description */}
      <div className="text-[#64748b] text-xs leading-relaxed flex-1 line-clamp-3">{app.description}</div>

      {/* Action area */}
      <div className="mt-auto pt-1">
        {!installed && (
          <button
            onClick={onClone}
            disabled={cloning}
            className="w-full py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: cloning ? '#22223b' : `${app.color}22`,
              color: cloning ? '#64748b' : app.color,
              border: `1px solid ${app.color}33`
            }}
          >
            {cloning ? '⏳ Cloning…' : '↓ Clone'}
          </button>
        )}

        {installed && !isServer && (
          <button
            onClick={onLaunch}
            className="w-full py-2 rounded-xl text-sm font-semibold bg-[#5b5ef4]/20 hover:bg-[#5b5ef4]/30 text-[#5b5ef4] border border-[#5b5ef4]/30 transition-colors"
          >
            Open App ↗
          </button>
        )}

        {installed && isServer && !serverRunning && (
          <button
            onClick={onStartServer}
            className="w-full py-2 rounded-xl text-sm font-semibold transition-colors"
            style={{
              background: `${app.color}22`,
              color: app.color,
              border: `1px solid ${app.color}33`
            }}
          >
            ▶ Start &amp; Launch
          </button>
        )}

        {installed && isServer && serverRunning && (
          <div className="flex gap-2">
            <button
              onClick={onLaunch}
              className="flex-1 py-2 rounded-xl text-sm font-semibold bg-[#22c55e]/20 hover:bg-[#22c55e]/30 text-[#22c55e] border border-[#22c55e]/30 transition-colors"
            >
              Open ↗ :{serverPort}
            </button>
            <button
              onClick={onStopServer}
              className="px-3 py-2 rounded-xl text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-colors"
              title="Stop server"
            >
              ■
            </button>
          </div>
        )}
      </div>

      {/* Last backup footer */}
      {lastBackup && (
        <div className="border-t border-white/[0.06] pt-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span style={{ color: '#f59e0b', fontSize: 11, flexShrink: 0 }}>⬆</span>
            <span
              className="text-[10px] text-[#64748b] truncate"
              title={lastBackup.fileName}
            >
              {lastBackup.fileName.length > 26
                ? lastBackup.fileName.slice(0, 23) + '…'
                : lastBackup.fileName}
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-[10px] text-[#4a5568]">{relativeDate(lastBackup.copiedAt)}</span>
            {backupFolder && (
              <button
                onClick={onOpenBackupFolder}
                title="Open backup folder"
                className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium text-[#f59e0b]/70 hover:text-[#f59e0b] hover:bg-[#f59e0b]/10 border border-[#f59e0b]/20 hover:border-[#f59e0b]/40 transition-colors"
              >
                <FolderOpenIcon />
                Show
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

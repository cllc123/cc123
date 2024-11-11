/**
 * @description This file handles hot updates for the electron renderer layer
 */
import { createHash } from "node:crypto"
import { existsSync, readFileSync } from "node:fs"
import { mkdir, readdir, rename, rm, stat, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"

import { callWindowExpose } from "@follow/shared/bridge"
import { version as appVersion } from "@pkg"
import { load } from "js-yaml"
import { memoize } from "lodash-es"
import { gte } from "semver"
import { x } from "tar"

import { GITHUB_OWNER, GITHUB_REPO, HOTUPDATE_RENDER_ENTRY_DIR } from "~/constants/app"
import { logger } from "~/logger"
import {
  hotUpdateAppNotSupportTriggerTrack,
  hotUpdateDownloadTrack,
  hotUpdateRenderSuccessTrack,
} from "~/tracker"
import { getMainWindow } from "~/window"

import { appUpdaterConfig } from "./configs"
import { autoUpdater } from "./electron-updater"
import type { GitHubReleasesItem } from "./types"
import { shouldUpdateApp } from "./utils"

const isNightlyBuild = appVersion.includes("nightly")

const url = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`
const releasesUrl = `${url}/releases`
const releaseApiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases`

const getLatestReleaseTag = memoize(async () => {
  if (!isNightlyBuild) {
    const res = await fetch(`${releaseApiUrl}/latest`)
    const json = await res.json()

    return json.tag_name
  } else {
    const res = await fetch(releaseApiUrl)
    const json = (await res.json()) as GitHubReleasesItem[]

    // Search the top nightly release
    const nightlyRelease = json.find((item) => item.prerelease && item.tag_name.includes("nightly"))
    if (!nightlyRelease) return json[0].tag_name
    return nightlyRelease.tag_name
  }
})

const getFileDownloadUrl = async (filename: string) => {
  const tag = await getLatestReleaseTag()

  return `${releasesUrl}/download/${tag}/${filename}`
}

type Manifest = {
  /** Render  version */
  version: string
  hash: string
  commit: string
  filename: string
  /** Supported minimum app version */
  minimum: string
}
const getLatestReleaseManifest = memoize(async () => {
  const url = await getFileDownloadUrl("manifest.yml")
  const res = await fetch(url)
  const text = await res.text()
  return load(text) as Manifest
})
const downloadTempDir = path.resolve(os.tmpdir(), "follow-render-update")

const canUpdateRender = async () => {
  const manifest = await getLatestReleaseManifest()

  logger.info("fetched manifest", manifest)

  if (!manifest) return false
  if (!shouldUpdateApp(appVersion, manifest.version)) return false

  const appSupport = gte(appVersion, manifest.minimum)
  if (!appSupport) {
    hotUpdateAppNotSupportTriggerTrack({
      appVersion,
      manifestVersion: manifest.version,
    })

    // Trigger app force update
    autoUpdater
      .checkForUpdates()
      .then(() => {
        autoUpdater.downloadUpdate().catch((e) => {
          logger.error("Failed to download update", e)
        })
      })
      .catch((e) => {
        logger.error("Failed to check for updates", e)
      })
    return false
  }

  const isVersionEqual = appVersion === manifest.version
  if (isVersionEqual) {
    logger.info("version is equal, skip update")
    return false
  }
  const isCommitEqual = GIT_COMMIT_HASH === manifest.commit
  if (isCommitEqual) {
    logger.info("commit is equal, skip update")
    return false
  }

  const manifestFilePath = path.resolve(HOTUPDATE_RENDER_ENTRY_DIR, "manifest.yml")
  const manifestExist = existsSync(manifestFilePath)

  const oldManifest: Manifest | null = manifestExist
    ? (load(readFileSync(manifestFilePath, "utf-8")) as Manifest)
    : null

  if (oldManifest) {
    if (oldManifest.version === manifest.version) {
      logger.info("manifest version is equal, skip update")
      return false
    }
    if (oldManifest.commit === manifest.commit) {
      logger.info("manifest commit is equal, skip update")
      return false
    }
  }
  return true
}
const downloadRenderAsset = async () => {
  const manifest = await getLatestReleaseManifest()
  if (!manifest) {
    logger.error("Failed to get latest release manifest")
    return false
  }
  hotUpdateDownloadTrack(manifest.version)
  const { filename } = manifest
  const url = await getFileDownloadUrl(filename)

  logger.info(`Downloading ${url}`)
  const res = await fetch(url)
  const arrayBuffer = await res.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const filePath = path.resolve(downloadTempDir, filename)
  await mkdir(downloadTempDir, { recursive: true })
  await writeFile(filePath, buffer)

  const sha256 = createHash("sha256")
  sha256.update(buffer)
  const hash = sha256.digest("hex")
  if (hash !== manifest.hash) {
    logger.error("Hash mismatch", hash, manifest.hash)
    return false
  }
  return filePath
}
export const hotUpdateRender = async () => {
  if (!appUpdaterConfig.enableRenderHotUpdate) return false
  if (!(await canUpdateRender())) return false

  const filePath = await downloadRenderAsset()
  if (!filePath) return false

  // Extract the tar.gz file
  await mkdir(HOTUPDATE_RENDER_ENTRY_DIR, { recursive: true })
  await x({
    f: filePath,
    gzip: true,
    cwd: HOTUPDATE_RENDER_ENTRY_DIR,
  })
  const manifest = await getLatestReleaseManifest()
  if (!manifest) return false

  // Rename `renderer` folder to `manifest.version`
  await rename(
    path.resolve(HOTUPDATE_RENDER_ENTRY_DIR, "renderer"),
    path.resolve(HOTUPDATE_RENDER_ENTRY_DIR, manifest.version),
  )

  await writeFile(
    path.resolve(HOTUPDATE_RENDER_ENTRY_DIR, "manifest.yml"),
    JSON.stringify(manifest),
  )
  logger.info(`Hot update render success, update to ${manifest.version}`)
  hotUpdateRenderSuccessTrack(manifest.version)
  const mainWindow = getMainWindow()
  if (!mainWindow) return false
  const caller = callWindowExpose(mainWindow)
  caller.readyToUpdate()
  return true
}

export const getCurrentRenderManifest = () => {
  const manifestFilePath = path.resolve(HOTUPDATE_RENDER_ENTRY_DIR, "manifest.yml")
  const manifestExist = existsSync(manifestFilePath)
  if (!manifestExist) return null
  return load(readFileSync(manifestFilePath, "utf-8")) as Manifest
}
export const cleanupOldRender = async () => {
  const manifest = getCurrentRenderManifest()
  if (!manifest) {
    // Empty the directory
    await rm(HOTUPDATE_RENDER_ENTRY_DIR, { recursive: true, force: true })
    return
  }

  const currentRenderVersion = manifest.version
  // Clean all not current version
  const dirs = await readdir(HOTUPDATE_RENDER_ENTRY_DIR)
  for (const dir of dirs) {
    const isDir = (await stat(path.resolve(HOTUPDATE_RENDER_ENTRY_DIR, dir))).isDirectory()
    if (!isDir) continue
    if (dir === currentRenderVersion) continue
    await rm(path.resolve(HOTUPDATE_RENDER_ENTRY_DIR, dir), { recursive: true, force: true })
  }
}

export const loadDynamicRenderEntry = () => {
  const manifest = getCurrentRenderManifest()
  if (!manifest) return
  const currentRenderVersion = manifest.version
  const dir = path.resolve(HOTUPDATE_RENDER_ENTRY_DIR, currentRenderVersion)
  const entryFile = path.resolve(dir, "index.html")
  const entryFileExists = existsSync(entryFile)
  if (!entryFileExists) return
  return entryFile
}

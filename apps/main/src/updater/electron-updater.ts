import { autoUpdater as defaultAutoUpdater } from "electron-updater"

import { isWindows } from "../env"
import { WindowsUpdater } from "./windows-updater"

export const autoUpdater = isWindows ? new WindowsUpdater() : defaultAutoUpdater

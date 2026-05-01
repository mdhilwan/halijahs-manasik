import fs from 'node:fs'
import path from 'node:path'

const CMS_DIR = process.cwd() // when run from cms/, this is /.../halijahs-manasik/cms
const REPO_ROOT = path.resolve(CMS_DIR, '..')

const TENANTS = ['halijah', 'manasiktech']

function copyFileSyncEnsured(src, dest) {
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(src, dest)
}

for (const tenant of TENANTS) {
    const src = path.join(REPO_ROOT, 'assets', 'images', tenant, 'icon.png')
    const dest = path.join(CMS_DIR, 'public', 'images', tenant, 'icon.png')

    if (!fs.existsSync(src)) {
        console.warn(`[sync-tenant-icons] Missing source: ${src}`)
        continue
    }

    copyFileSyncEnsured(src, dest)
    console.log(`[sync-tenant-icons] Copied ${src} -> ${dest}`)
}
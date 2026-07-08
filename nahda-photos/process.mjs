// Optimize real Al Nahda photos dropped in this folder.
//   node nahda-photos/process.mjs
// Reads every image in nahda-photos/ (jpg/jpeg/png/webp; heic via ffmpeg fallback)
// and writes two optimized sets WITHOUT touching the live /public images:
//   nahda-photos/_web/   -> 1400px max, webp q80  (for /al-nahda cards, hero, about)
//   nahda-photos/_maps/  -> 2048px max, jpg q88   (for Google Maps upload)
// Mapping each _web/ file to a service key happens in a deliberate second step.
import { readdir, mkdir, stat } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import sharp from 'sharp'

const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
const WEB = path.join(HERE, '_web')
const MAPS = path.join(HERE, '_maps')
const SRC_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'])

await mkdir(WEB, { recursive: true })
await mkdir(MAPS, { recursive: true })

const entries = (await readdir(HERE)).filter(f => SRC_EXT.has(path.extname(f).toLowerCase()))
if (!entries.length) {
  console.log('No images found in nahda-photos/. Paste the photos in and re-run.')
  process.exit(0)
}

let ok = 0
for (const file of entries) {
  const src = path.join(HERE, file)
  const base = path.basename(file, path.extname(file)).replace(/\s+/g, '-').toLowerCase()
  let inputBuf
  const ext = path.extname(file).toLowerCase()
  try {
    if (ext === '.heic' || ext === '.heif') {
      // sharp often lacks HEIC; transcode to PNG via ffmpeg first.
      const tmp = path.join(HERE, `${base}.__tmp.png`)
      execFileSync('ffmpeg', ['-y', '-i', src, tmp], { stdio: 'ignore' })
      inputBuf = tmp
    } else {
      inputBuf = src
    }
    await sharp(inputBuf).rotate().resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 80 }).toFile(path.join(WEB, `${base}.webp`))
    await sharp(inputBuf).rotate().resize({ width: 2048, withoutEnlargement: true })
      .jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(MAPS, `${base}.jpg`))
    const { size } = await stat(path.join(WEB, `${base}.webp`))
    console.log(`✓ ${file}  ->  _web/${base}.webp (${(size / 1024).toFixed(0)} KB)  +  _maps/${base}.jpg`)
    ok++
  } catch (e) {
    console.log(`✗ ${file}  FAILED: ${e.message.split('\n')[0]}`)
  }
}
console.log(`\nDone: ${ok}/${entries.length} processed. Web set -> _web/  ·  Maps set -> _maps/`)

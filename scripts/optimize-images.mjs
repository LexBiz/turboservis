import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const repoRoot = path.resolve(process.cwd());
const imagesDir = path.join(repoRoot, "frontend", "public", "images");
const outDir = path.join(imagesDir, "opt");

const HERO_MAIN = "hero-main-2560x1200.jpg";
const CTA = "cta-banner-1920x500.jpg";
const HERO_PAGES = [
  "ua hero-about-2560x900.jpg",
  "ua hero-contacts-2560x900.jpg",
  "ua hero-services-2560x900.jpg",
  "cz hero-about-2560x900.jpg",
  "cz hero-contacts-2560x900.jpg",
  "cz hero-services-2560x900.jpg"
];
const SERVICES = [
  "service-egrdpf-800x800.jpg",
  "service-engine-800x800.jpg",
  "service-injectors-800x800.jpg",
  "service-maintenance-800x800.jpg",
  "service-repair-800x800.jpg",
  "service-suspension-800x800.jpg",
  "service-turbo-800x800.jpg",
  "ua service-diagnostics-800x800.jpg",
  "cz service-diagnostics-800x800.jpg"
];

function baseNameForOpt(filename) {
  //  "ua hero-services-2560x900.jpg" -> "ua-hero-services"
  //  "service-turbo-800x800.jpg" -> "service-turbo"
  const noSpaces = filename.replaceAll(" ", "-");
  const stripped = noSpaces.replace(/-\d+x\d+\.(jpg|jpeg|png)$/i, "");
  return stripped.replace(/\.(jpg|jpeg|png)$/i, "");
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function generateVariants({ srcFile, widths, quality = 78 }) {
  const srcPath = path.join(imagesDir, srcFile);
  if (!(await exists(srcPath))) {
    console.log(`[skip] missing: ${srcFile}`);
    return;
  }

  const base = baseNameForOpt(srcFile);
  const image = sharp(srcPath, { failOn: "none" });
  const meta = await image.metadata();
  const srcW = meta.width ?? 0;

  for (const w of widths) {
    const targetW = Math.min(w, srcW || w);
    const outWebp = path.join(outDir, `${base}-${w}.webp`);
    const outJpg = path.join(outDir, `${base}-${w}.jpg`);

    // WebP
    if (!(await exists(outWebp))) {
      await sharp(srcPath, { failOn: "none" })
        .resize({ width: targetW, withoutEnlargement: true })
        .webp({ quality })
        .toFile(outWebp);
      console.log(`[ok] ${path.relative(repoRoot, outWebp)}`);
    }

    // JPG fallback
    if (!(await exists(outJpg))) {
      await sharp(srcPath, { failOn: "none" })
        .resize({ width: targetW, withoutEnlargement: true })
        .jpeg({ quality, mozjpeg: true })
        .toFile(outJpg);
      console.log(`[ok] ${path.relative(repoRoot, outJpg)}`);
    }
  }
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });

  await generateVariants({ srcFile: HERO_MAIN, widths: [900, 1600], quality: 75 });
  await generateVariants({ srcFile: CTA, widths: [900, 1400], quality: 75 });

  for (const f of HERO_PAGES) {
    await generateVariants({ srcFile: f, widths: [900, 1600], quality: 75 });
  }

  for (const f of SERVICES) {
    await generateVariants({ srcFile: f, widths: [400, 800], quality: 78 });
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});



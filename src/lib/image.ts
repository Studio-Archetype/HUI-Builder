import type { ImageDef } from "@/stores/images";

export interface Vector4 {
  r: number;
  g: number;
  b: number;
  a: number;
}

export function getFileParts(filename: string): string[] {
  const dotSplit = filename.split(".");
  if (dotSplit.length === 1 || (dotSplit[0] === "" && dotSplit.length === 2)) {
    return [filename, ""];
  }

  const ext = dotSplit.pop();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return [dotSplit.join("."), ext!];
}

export function ensurePath(path: string): string {
  const fileParts = getFileParts(path);
  if (!fileParts[1]) fileParts[1] = "png";
  path = fileParts.join(".");

  if (!path.startsWith("/")) path = `/${path}`;

  return path;
}

export interface Dimension {
  width: number;
  height: number;
}

export function imageToColorMap(image: HTMLImageElement): Vector4[][] {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = image.width;
  canvas.height = image.height;

  ctx?.drawImage(image, 0, 0);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { data } = ctx!.getImageData(0, 0, canvas.width, canvas.height);

  const imageOut: Vector4[][] = [];
  let cursorX = 0,
    cursorY = 0,
    cursorTotal = 0;

  while (cursorY < image.height) {
    const row: Vector4[] = [];
    while (cursorX < image.width) {
      row.push({
        r: data[cursorTotal],
        g: data[cursorTotal + 1],
        b: data[cursorTotal + 2],
        a: data[cursorTotal + 3],
      });

      cursorTotal += 4;
      cursorX++;
    }

    imageOut.push(row);
    cursorX = 0;
    cursorY++;
  }
  return imageOut;
}

const imageCache = new Map<string, HTMLImageElement>();

export async function getImage(imageDef: ImageDef): Promise<HTMLImageElement> {
  if (imageCache.has(imageDef.path))
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return Promise.resolve(imageCache.get(imageDef.path)!);
  else {
    return new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.onload = () => {
        imageCache.set(imageDef.path, img);
        resolve(img);
      };
      img.src = imageDef.content;
    });
  }
}

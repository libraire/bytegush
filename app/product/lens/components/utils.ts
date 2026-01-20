
const IMAGE_HOST = process.env.NEXT_PUBLIC_IMAGE_HOST


export const imageLoader = ({
    src,
    width,
    quality,
  }: {
    src: string;
    width: number;
    quality?: number;
  }) => {
    //   s = Small Square (90×90) as seen in the example above
    // b = Big Square (160×160)
    // t = Small Thumbnail (160×160)
    // m = Medium Thumbnail (320×320)
    // l = Large Thumbnail (640×640) as seen in the example above
    // h = Huge Thumbnail (1024×1024)

    if (src.includes("imgur")) {
      return `${src}h.jpg`;
    }else if (src.startsWith("http") || src.startsWith("https")) {
      return src;
    }else if ("/user.png" == src) {
      return src;
    }

    return `${IMAGE_HOST}/images/${src}`;
  };


  export function generateSVG(num: any) {
    var svgCode = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200' fill='white'>
        <rect width='100%' height='100%' fill='black' />
        <text x='50%' y='50%' text-anchor='middle' dominant-baseline='central' font-size='144' fill='white'>${num}</text>
      </svg>`;
  
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svgCode);
  }
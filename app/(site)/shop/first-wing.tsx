export type CollectionGroup = "upper" | "lower" | "accessories";
export type CollectionFilter = "all" | CollectionGroup;
export type GarmentShape = "hoodie" | "tee" | "trouser" | "chain" | "cap";

export type CollectionPiece = {
  slug: string;
  index: string;
  name: string;
  type: string;
  category: CollectionGroup;
  color: string;
  tone: string;
  accent: string;
  shape: GarmentShape;
  story: string;
  material: string;
  fit: string;
  detail: string;
};

export const COLLECTION: CollectionPiece[] = [
  {
    slug: "ascension-zip",
    index: "01",
    name: "Ascension Zip",
    type: "Zip hoodie",
    category: "upper",
    color: "Ink",
    tone: "#161616",
    accent: "#d5d0c6",
    shape: "hoodie",
    story:
      "A sculpted double-layer zip hoodie built around restraint: dropped shoulders, a quiet metal closure and a silhouette that holds its form.",
    material: "Heavyweight brushed cotton",
    fit: "Relaxed, structured",
    detail: "Double hood · two-way zip · tonal embroidery",
  },
  {
    slug: "halo-zip",
    index: "02",
    name: "Halo Zip",
    type: "Zip hoodie",
    category: "upper",
    color: "Bone",
    tone: "#d8d2c6",
    accent: "#272623",
    shape: "hoodie",
    story:
      "The lighter counterpart. A calm bone shade reveals the panel construction, finished with a curved seam that traces the shoulder like a wing.",
    material: "Heavyweight brushed cotton",
    fit: "Relaxed, structured",
    detail: "Curved back seam · two-way zip · internal label",
  },
  {
    slug: "seraph-tee",
    index: "03",
    name: "Seraph Tee",
    type: "T-shirt",
    category: "upper",
    color: "Chalk",
    tone: "#e4e0d6",
    accent: "#22211f",
    shape: "tee",
    story:
      "A dense cotton tee with an exact, architectural fall. The front stays silent; the collection mark appears discreetly beneath the back neckline.",
    material: "Compact cotton jersey",
    fit: "Boxy, slightly cropped",
    detail: "Bound neck · blind hem · back-neck signature",
  },
  {
    slug: "silence-tee",
    index: "04",
    name: "Silence Tee",
    type: "T-shirt",
    category: "upper",
    color: "Obsidian",
    tone: "#111111",
    accent: "#d8d4ca",
    shape: "tee",
    story:
      "An obsidian essential with weight and intention. Cut wider through the body to create presence without relying on visible branding.",
    material: "Compact cotton jersey",
    fit: "Oversized, clean shoulder",
    detail: "Reinforced collar · tonal mark · numbered label",
  },
  {
    slug: "passage-trouser",
    index: "05",
    name: "Passage Trouser",
    type: "Trouser",
    category: "lower",
    color: "Coal",
    tone: "#242422",
    accent: "#d2cec4",
    shape: "trouser",
    story:
      "A straight-leg trouser that moves between tailoring and daily uniform. The elongated line is interrupted only by a concealed side adjustment.",
    material: "Structured cotton twill",
    fit: "Straight, long break",
    detail: "Hidden adjuster · pressed front · deep side pockets",
  },
  {
    slug: "gate-trouser",
    index: "06",
    name: "Gate Trouser",
    type: "Trouser",
    category: "lower",
    color: "Sand",
    tone: "#c0b7a7",
    accent: "#292824",
    shape: "trouser",
    story:
      "A soft sand trouser shaped with a single forward pleat. Designed as a counterpoint to the darker upper pieces in The First Wing.",
    material: "Washed cotton canvas",
    fit: "Relaxed taper",
    detail: "Single pleat · internal drawcord · rear welt pocket",
  },
  {
    slug: "eighth-door-chain",
    index: "07",
    name: "Eighth Door Chain",
    type: "Jewellery",
    category: "accessories",
    color: "Silver",
    tone: "#b7b6b2",
    accent: "#222222",
    shape: "chain",
    story:
      "Eight connected forms create a restrained silver chain. Each link recalls a threshold: seven passed, the eighth still to be opened.",
    material: "Polished stainless steel",
    fit: "Adjustable length",
    detail: "Eight signature links · hidden clasp · engraved mark",
  },
  {
    slug: "first-wing-cap",
    index: "08",
    name: "First Wing Cap",
    type: "Cap",
    category: "accessories",
    color: "Black",
    tone: "#151515",
    accent: "#d8d4ca",
    shape: "cap",
    story:
      "The collection’s final piece and its quiet signature. A six-panel cap with a softened crown and a wing line stitched almost invisibly at the side.",
    material: "Brushed cotton twill",
    fit: "Low profile, adjustable",
    detail: "Six panels · metal adjuster · side-wing embroidery",
  },
];

export function GarmentDrawing({
  piece,
  className = "h-full w-full",
}: {
  piece: CollectionPiece;
  className?: string;
}) {
  const background =
    piece.category === "accessories" ? "#cbc7be" : "#d7d3ca";
  const gradientId = `cloth-${piece.index}`;
  const shadowId = `shadow-${piece.index}`;
  const gradient = `url(#${gradientId})`;
  const shadow = `url(#${shadowId})`;

  return (
    <svg
      viewBox="0 0 500 650"
      role="img"
      aria-label={`${piece.name}, ${piece.color}`}
      xmlns="http://www.w3.org/2000/svg"
      className={`block ${className} transition duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.035] group-hover:contrast-[1.05]`}
      style={{ background }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={piece.tone} />
          <stop offset=".55" stopColor={piece.tone} />
          <stop offset="1" stopColor={piece.accent} stopOpacity=".24" />
        </linearGradient>
        <filter id={shadowId}>
          <feDropShadow dx="0" dy="18" stdDeviation="16" floodOpacity=".2" />
        </filter>
      </defs>

      <path d="M0 0h500v650H0z" fill="none" />

      {piece.shape === "hoodie" && (
        <g filter={shadow}>
          <path d="M176 188c8-47 34-79 74-79s67 32 75 79l61 37 68 122-66 40-36-55 13 225H136l13-225-36 55-66-40 68-122z" fill={gradient} stroke={piece.accent} strokeOpacity=".42" />
          <path d="M177 190c17 35 42 52 73 52s57-17 75-52c-5-50-29-81-75-81s-70 31-73 81z" fill="none" stroke={piece.accent} strokeOpacity=".52" />
          <path d="M250 241v316M176 420l74-12 74 12M166 504l84-34 84 34" fill="none" stroke={piece.accent} strokeOpacity=".44" />
          <circle cx="250" cy="270" r="3" fill={piece.accent} />
        </g>
      )}

      {piece.shape === "tee" && (
        <g filter={shadow}>
          <path d="M170 168l51-19c7 15 17 22 29 22s22-7 29-22l51 19 106 86-57 88-55-38 19 251H157l19-251-55 38-57-88z" fill={gradient} stroke={piece.accent} strokeOpacity=".42" />
          <path d="M221 149c2 28 12 41 29 41s27-13 29-41M158 527h184" fill="none" stroke={piece.accent} strokeOpacity=".48" />
          <path d="M239 207h22" stroke={piece.accent} strokeOpacity=".36" />
        </g>
      )}

      {piece.shape === "trouser" && (
        <g filter={shadow}>
          <path d="M148 117h204l18 198-49 249-78-1 7-254-7 254-78 1-35-249z" fill={gradient} stroke={piece.accent} strokeOpacity=".42" />
          <path d="M148 151h204M250 153v156M162 190l62 24M338 190l-62 24M181 538h62M259 538h62" fill="none" stroke={piece.accent} strokeOpacity=".48" />
          <circle cx="250" cy="134" r="3" fill={piece.accent} />
        </g>
      )}

      {piece.shape === "chain" && (
        <g filter={shadow} fill="none" stroke={gradient} strokeWidth="18">
          <ellipse cx="250" cy="323" rx="135" ry="197" />
          <ellipse cx="171" cy="180" rx="25" ry="39" transform="rotate(-30 171 180)" />
          <ellipse cx="329" cy="180" rx="25" ry="39" transform="rotate(30 329 180)" />
          <ellipse cx="132" cy="285" rx="25" ry="39" transform="rotate(-8 132 285)" />
          <ellipse cx="368" cy="285" rx="25" ry="39" transform="rotate(8 368 285)" />
          <ellipse cx="167" cy="447" rx="25" ry="39" transform="rotate(26 167 447)" />
          <ellipse cx="333" cy="447" rx="25" ry="39" transform="rotate(-26 333 447)" />
          <ellipse cx="250" cy="508" rx="25" ry="39" />
          <ellipse cx="250" cy="130" rx="25" ry="39" />
        </g>
      )}

      {piece.shape === "cap" && (
        <g filter={shadow}>
          <path d="M112 350c10-118 57-190 142-190 89 0 137 72 143 190-83-31-190-31-285 0z" fill={gradient} stroke={piece.accent} strokeOpacity=".45" />
          <path d="M112 350c82-31 192-31 285 0 41 14 72 44 87 78-90-21-172-27-247-11-58 13-105-10-125-67z" fill={gradient} stroke={piece.accent} strokeOpacity=".45" />
          <path d="M254 160v164M173 190c42 37 69 82 81 134M335 190c-42 37-69 82-81 134" fill="none" stroke={piece.accent} strokeOpacity=".38" />
          <path d="M350 300c-24 6-44 18-61 38" fill="none" stroke={piece.accent} strokeOpacity=".72" />
        </g>
      )}

      <text x="25" y="35" fill="#111" opacity=".45" fontSize="9" letterSpacing="2">
        PA / {piece.index}
      </text>
    </svg>
  );
}

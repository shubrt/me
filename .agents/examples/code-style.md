# Code style examples

Use these examples as the reference for the [coding rules](../coding.md#readability). They show the operation-first layout and explicit field mappings. Responsibility and readability still determine function size and file boundaries.

Names, fields and imports below are illustrative, not existing APIs or required abstractions. Use the actual module's context and schema-derived types. These read-only examples assume validated inputs.

## Service: show the flow, keep details below

`src/service/summarize-document-assets.ts`

```ts
import type { Context } from "../_/context.ts";
import { listDocumentAssets } from "./asset.ts";

export async function summarizeDocumentAssets(ctx: Context, documentId: string) {
  const assets = await listDocumentAssets(ctx, documentId);
  const formats = countFormats(assets);

  return { total: assets.length, formats };
}

function countFormats(assets: Awaited<ReturnType<typeof listDocumentAssets>>) {
  const counts: Record<string, number> = {};

  for (const asset of assets) {
    const format = asset.mediaType ?? "unspecified";
    counts[format] = (counts[format] ?? 0) + 1;
  }

  return counts;
}
```

The public function shows the lookup, calculation and result. The helper names the calculation and keeps its loop in the same file. Its input type follows the lookup. Failures propagate to the caller that handles them.

## Mapper: show where each field comes from

`src/helper/map-asset-metadata.ts`

```ts
import type { AssetMetadata } from "../schema/asset-metadata.ts";

export function mapAssetMetadata(metadata: AssetMetadata) {
  return {
    name: metadata.title.trim(),
    description: resolveDescription(metadata),
    tags: normalizeTags(metadata),
  };
}

function resolveDescription(metadata: AssetMetadata) {
  for (const value of [metadata.caption, metadata.description]) {
    const description = value?.trim();

    if (description) {
      return description;
    }
  }

  return null;
}

function normalizeTags(metadata: AssetMetadata) {
  const tags = metadata.keywords
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length > 0);

  return [...new Set(tags)];
}
```

The object exposes each field's source. The helpers contain the fallback order and tag normalization. The single trim stays inline. All helpers are private, and the input remains unchanged.


export function getPageTitleSection(page: IPageContent): IPageSection {
    return page.sections[page.page.sections[0]];
  }

export function getPageTitleText(page: IPageContent, attr: "storyTitle" | "byline" | "leadIn" = "storyTitle"): string {
  const section = getPageTitleSection(page);
  const layer = section.layers.find(l => l.kind === "text-blocks") as TextBlocksLayer;
  if (layer) {
    for (let i = 0, len = layer.items.length; i < len; i++) {
      const item = layer.items[i];
      if (attr in item) {
        try {
          const res = extractText((item as any)[attr]);
          if (attr === "byline") {
            return res.replace("By ", "");
          }
          return res;
        } catch (err) {
          // Skip
        }
      }
    }
  }
  return "";

  export function getPageCoverImages(page: IPageContent): { landscape: string | null; portrait: string | null } {
    const section = getPageTitleSection(page);
    const mediaLayer = section?.layers.find(isMediaLayer) as BackgroundViewportLayer;
    const coverItem = mediaLayer?.items[0];
    if (section?.settings.layout !== "TextOnly" && coverItem) {
      switch (coverItem.kind) {
        case "image":
        case "cyclops":
          return pickMedia(
            coverItem.landscape?.image?.id,
            coverItem.landscape?.image?.isUserDefined,
            coverItem.portrait?.image?.id,
            coverItem.portrait?.image?.isUserDefined
          );
        case "video":
          return pickMedia(
            coverItem.landscape?.fallback?.id ?? coverItem.landscape?.poster?.id,
            coverItem.landscape?.fallback?.id ? coverItem.landscape.fallback.isUserDefined : coverItem.landscape?.poster?.isUserDefined,
            coverItem.portrait?.fallback?.id ?? coverItem.portrait?.poster?.id,
            coverItem.portrait?.fallback?.id ? coverItem.portrait?.fallback?.isUserDefined : coverItem.portrait?.poster?.isUserDefined
          );
      }
    }
  
    return {
      landscape: null,
      portrait: null,
    };
  }


  /**
 * Extract the text content from the document, ignoring all markup and other nodes.
 * @param json
 * @returns
 */
export function extractText(json?: DocElement | BlockElement | ListItem | InlineElement | Array<BlockElement | ListItem | InlineElement>): string 
{
  if (!json) {
    return "";
  } else if (Array.isArray(json)) {
    return json.map(extractText).join("");
  } else if (json.type === "text") {
    return json.text;
  } else if ("content" in json && json.content) {
    return (json.content as Array<BlockElement | ListItem | InlineElement>).map(extractText).join("");
  } else {
    return "";
  }
}
 // section?.settings.layout
 section?.settings.layout !== "TextOnly" && coverItem
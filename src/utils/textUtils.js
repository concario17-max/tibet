export const flattenVerses = (data) => {
    if (!data) return [];

    const flatList = [];
    for (const item of data) {
        if (item.verses && item.verses.length > 0) {
            flatList.push(...item.verses);
        } else if (item.isGroup && item.subchapters) {
            for (const sub of item.subchapters) {
                if (sub.verses && sub.verses.length > 0) {
                    flatList.push(...sub.verses);
                }
            }
        }
    }
    return flatList;
};

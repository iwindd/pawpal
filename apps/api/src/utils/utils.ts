const utils = {
  getHello: () => {
    return 'Hello Pawpal API!';
  },
  splitTags: (tags: string | string[]): string[] => {
    let tagsArray: string[];

    if (typeof tags === 'string') {
      tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
    } else if (Array.isArray(tags)) {
      tagsArray = tags.flatMap((tag) =>
        typeof tag === 'string'
          ? tag
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      );
    } else {
      tagsArray = [];
    }

    return tagsArray;
  },
};

export default utils;

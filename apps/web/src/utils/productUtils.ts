export const getSectionIcon = (slug: string) => {
  switch (slug) {
    case "flashsale":
      return "🔥";
    case "popular":
      return "⭐";
    case "new":
      return "✨";
    case "latest":
      return "🆕";
    default:
      return "📦";
  }
};

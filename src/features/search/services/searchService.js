import { searchPolls, searchUsers, getSuggestions, getTrendingPolls, getLatestPolls, getPopularPolls, getCategories, getEndingSoonPolls, getRecommendedPolls, getSearchHistory, deleteSearchHistory, deleteSearchHistoryItem } from "../api/searchApi";

export const searchService = {
  searchPolls,
  searchUsers,
  getSuggestions,
  getTrendingPolls,
  getLatestPolls,
  getPopularPolls,
  getCategories,
  getEndingSoonPolls,
  getRecommendedPolls,
  getSearchHistory,
  deleteSearchHistory,
  deleteSearchHistoryItem,
};

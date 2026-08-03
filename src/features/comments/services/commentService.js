import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  replyToComment,
  likeComment,
  unlikeComment,
  pinComment,
  unpinComment,
  reportComment,
  getCommentAnalytics,
} from "../api/commentsApi";

export const commentService = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  replyToComment,
  likeComment,
  unlikeComment,
  pinComment,
  unpinComment,
  reportComment,
  getCommentAnalytics,
};

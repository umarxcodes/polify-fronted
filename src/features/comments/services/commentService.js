import { getComments, createComment, updateComment, deleteComment, replyToComment, likeComment, unlikeComment, pinComment, unpinComment, reportComment } from "../api/commentsApi";

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
};

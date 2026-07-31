import { useComments } from "../hooks/useComments";

const CommentsPage = () => {
  const { fetchComments, comments, loading, error } = useComments();

  return (
    <div>
      <h1>Comments</h1>
      <button onClick={fetchComments}>Load Comments</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error loading comments</p>}
      {comments && <pre>{JSON.stringify(comments, null, 2)}</pre>}
    </div>
  );
};

export default CommentsPage;

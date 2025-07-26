function MovieCard({ movie }) {
  const handleAddToWatchlist = async () => {
    const token = localStorage.getItem("token");
    await fetch("/api/movies/watchlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ movieId: movie.id, title: movie.title }),
    });
  };

  return (
    <div>
      <h3>{movie.title}</h3>
      <button onClick={handleAddToWatchlist}>Add to Watchlist</button>
    </div>
  );
}

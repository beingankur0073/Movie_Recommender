import React, { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, Box, Paper } from "@mui/material";

const App = () => {
  const [movieName, setMovieName] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!movieName) return;
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await axios.post("http://127.0.0.1:5000/recommend", { movie_name: movieName });
      setRecommendations(data.recommended_movies);
    } catch (err) {
      setError("Failed to fetch recommendations. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div>
    <Container 
        component={"main"} 
        maxWidth="xs"
        sx={{
        height:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        }}>
        <Paper
        elevation={3}
        sx={{
            padding:4,
            display:"flex",
            flexDirection:"column",
            alignItems:"center"
        }}>
            <Typography variant="h5" gutterBottom>
                Movie Recommender
            </Typography>
            <TextField
                label="Enter a Movie Name"
                variant="outlined"
                fullWidth
                value={movieName}
                onChange={(e) => setMovieName(e.target.value)}
                style={{ marginBottom: "20px" }}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                {loading ? "Fetching..." : "Get Recommendations"}
            </Button>
            {error && <Typography color="error" style={{ marginTop: "20px" }}>{error}</Typography>}
            {recommendations.length > 0 && (
                <Box mt={4} display="flex" flexDirection="column" alignItems="center" textAlign="center">
                    <Typography variant="h6">Recommended Movies:</Typography>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {recommendations.map((movie, index) => (
                            <li key={index}>{movie}</li>
                        ))}
                    </ul>
                </Box>
            )}
        </Paper>
    </Container>
   </div>
  );
};

export default App;

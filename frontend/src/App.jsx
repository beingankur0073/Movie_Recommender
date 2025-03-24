import React, { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, Box, Paper } from "@mui/material";

const App = () => {
  const [movieName, setMovieName] = useState("");
  const [genre, setGenre] = useState("");
  const [keyword, setKeyword] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!movieName) return;
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await axios.post("http://127.0.0.1:5000/recommend", { 
        movie_name: movieName, 
        genre,
        keyword
      });
      setRecommendations(data.recommended_movies);
    } catch (err) {
      setError("Failed to fetch recommendations. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div style={{
      backgroundImage: "url('/mv.png')", 
      backgroundSize: "cover", 
      backgroundPosition: "center", 
      height: "100vh",
      overflow: "hidden",
      width: "100vw",
      position: "absolute",  
        top: 0,               
        left: 0,              
        width: "100%",         
        height: "100%",
         
   }}>
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
            alignItems:"center",
            backgroundColor: "rgba(3, 17, 1, 0.9)",
            width: "120%",
            maxWidth: "500px",
            fontFamily: "'Henny Penny', 'Inter', 'Syne Mono', sans-serif"
        }}>
            <Typography 
            variant="h5" 
            gutterBottom 
             color="white"
             sx={{ fontFamily: "'Henny Penny', 'Inter', 'Syne Mono', sans-serif"}}
             >
                Movie Recommender
            </Typography>
            <TextField
                label="Enter a Movie Name"
                variant="outlined"
                fullWidth
                value={movieName}
                onChange={(e) => setMovieName(e.target.value)}
                sx={{ 
                    marginBottom: "20px", 
                    backgroundColor: "rgba(128, 128, 128, 1)", 
                    borderRadius: "5px" ,
                    '& .MuiInputLabel-root': { color: 'white' }
                }}
            />
            <TextField
                label="Genre"
                variant="outlined"
                fullWidth
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                sx={{ 
                    marginBottom: "20px", 
                    backgroundColor: "rgba(128, 128, 128, 1)", 
                    borderRadius: "5px" ,
                    '& .MuiInputLabel-root': { color: 'white' }
                }}
            />
            <TextField
                label="Keyword"
                variant="outlined"
                fullWidth
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                sx={{ 
                    marginBottom: "20px", 
                    backgroundColor: "rgba(128, 128, 128, 1)", 
                    borderRadius: "5px" ,
                    '& .MuiInputLabel-root': { color: 'white' }
                }}
            />
            <Button variant="contained"
              sx={{ backgroundColor: "red", '&:hover': { backgroundColor: "darkred" }}}
            onClick={handleSubmit} disabled={loading}>
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

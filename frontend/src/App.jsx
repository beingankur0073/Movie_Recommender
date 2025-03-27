import React, { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, Box, Paper,Grid,Skeleton } from "@mui/material";
import { motion } from "framer-motion";

const App = () => {
  const [movieName, setMovieName] = useState("");
  const [genres, setGenre] = useState("");
  const [keywords, setKeyword] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchMoviePosters = async (movieTitles) => {
    const apiKey = "b472338e672a95044a2f1011849b7a67"; // Replace with your actual TMDb API Key
    const movieData = [];
  
    for (const title of movieTitles) {
      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${title}`
        );
  
        if (data.results.length > 0) {
          const posterPath = data.results[0].poster_path;
          movieData.push({
            title,
            poster: posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : null
          });
        }
      } catch (error) {
        console.error(`Error fetching poster for ${title}:`, error);
      }
    }
    
    setLoading(false);
    setCurrentIndex(0);
    setRecommendations(movieData);
  };

  const toTitleCase = (title) => {
    return title
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };


  const handleNextMovies = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 4) % recommendations.length);
  };



  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const { data } = await axios.get("http://127.0.0.1:5000/recommend", {
        params: {
          title: movieName,
          genres,
          keywords
        }
      });
  
      if (data.recommendations && data.recommendations.length > 0) {
        const movieTitles = data.recommendations.map(movie => toTitleCase(movie.title));
        fetchMoviePosters(movieTitles);
      }
    } catch (err) {
      setError("Movie not found.Provide genres and keywords");
      setLoading(false);
    }
  };
  




  return (
   <div style={{
    background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(4, 4, 4, 0.9)), url('/mv.png')",

    
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

<div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7)), url('/mv.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: -1
      }}></div>



    <Container 
        component={"main"} 
        maxWidth="xxl"
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
            width: "80%",
            maxWidth: "800px",
            borderRadius: "10px",
           
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
                value={genres}
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
                value={keywords}
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
              <Typography variant="h6" color="white">Recommended Movies:</Typography>
              <Grid container spacing={2} justifyContent="center">
                {recommendations.slice(currentIndex, currentIndex + 4).map((movie, index) => (
                  <Grid item key={index}>
                    <motion.div
                      key={movie.title + currentIndex} // Ensures animation triggers on change
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                      <Paper sx={{ padding: 2, backgroundColor: "rgba(255, 255, 255, 0.1)", textAlign: "center" }}>
                        <Typography color="white" variant="subtitle2" sx={{ fontSize: "0.8rem" }}>
                          {movie.title}
                        </Typography>
                        <img src={movie.poster} alt={movie.title} style={{ width: "80px", height: "120px", borderRadius: "5px" }} />
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
              {recommendations.length > 4 && (
                <Button variant="contained" onClick={handleNextMovies} sx={{ mt: 2, backgroundColor: "blue", '&:hover': { backgroundColor: "darkblue" } }}>
                  Next Movies
                </Button>
              )}
            </Box>
          )}

        {loading && (
            <Box mt={4} display="flex" flexDirection="column" alignItems="center" textAlign="center">
              <Skeleton variant="rectangular" width={210} height={118} />
              <Skeleton variant="text" width={150} />
              <Skeleton variant="text" width={100} />
            </Box>
          )}
          

        </Paper>
    </Container>
   </div>
  );
};

export default App;

"use client";
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  Container,
  Card,
  CardContent,
  TextField,
  Box,
  IconButton,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import { ethers } from "ethers";
import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import Swal from "sweetalert2";

const [metaMask, hooks] = initializeConnector(
  (actions) => new MetaMask({ actions })
);
const { useAccounts, useIsActive, useProvider } = hooks;

const contractChain = 11155111;
const cinemaWalletAddress = "0x3b9c613100B417AfCC51476d7F766310644DcAfa";
const ticketPrice = "0.000001";

export default function MovieBookingForm() {
  const accounts = useAccounts();
  const isActive = useIsActive();
  const provider = useProvider();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [cinema, setCinema] = useState("");
  const [movie, setMovie] = useState("");
  const [showTime, setShowTime] = useState("");
  const [numSeats, setNumSeats] = useState(1);
  const [seatType, setSeatType] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState(false);
  const [cinemas, setCinemas] = useState([]);
  const [movies, setMovies] = useState([]);
  const [availableShowtimes, setAvailableShowtimes] = useState([]);

  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug("Failed to connect eagerly to MetaMask");
    });

    const fetchData = async () => {
      const cinemaData = await import("./cinema.json");
      setCinemas(cinemaData.cinemas);

      const movieData = await import("./movie.json");
      setMovies(movieData.movies);
    };

    fetchData();
  }, []);

  const handleMovieChange = (e) => {
    const selectedMovie = e.target.value;
    setMovie(selectedMovie);

    const movieDetails = movies.find((m) => m.title === selectedMovie);
    if (movieDetails) {
      setAvailableShowtimes(movieDetails.showtimes);
      setShowTime(movieDetails.showtimes[0]);
    } else {
      setAvailableShowtimes([]);
    }
  };

  const handleConnect = () => {
    metaMask.activate(contractChain);
  };

  const handleDisconnect = () => {
    metaMask.resetState();
    Swal.fire({
      icon: "info",
      title: "ยกเลิกการเชื่อมต่อกระเป๋าสตางค์",
      text: "เพื่อยกเลิกการเชื่อมต่ออย่างสมบูรณ์ กรุณาลบเว็บไซต์นี้ออกจากการเชื่อมต่อใน MetaMask",
    });
  };

  const handleBooking = async () => {
    if (!isActive || !provider) return;

    if (
      !name ||
      !contact ||
      !cinema ||
      !movie ||
      !showTime ||
      !numSeats ||
      !seatType ||
      !date
    ) {
      setError(true);
      return;
    }
    setError(false);

    try {
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: cinemaWalletAddress,
        value: ethers.utils.parseEther(ticketPrice),
      });
      Swal.fire({
        icon: "success",
        title: "การจองสำเร็จ!",
        text: `หมายเลขธุรกรรม: ${tx.hash}`,
      });
    } catch (error) {
      console.error("Booking failed:", error);
      Swal.fire({
        icon: "error",
        title: "การจองล้มเหลว",
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1485095329183-d0797cdc5676?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Paper sx={{ minHeight: "100vh", bgcolor: "transparent" }}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" sx={{ bgcolor: "#000000", padding: 1 }}>
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, color: "#ffffff" }}
              >
                ระบบจองตั๋วหนัง
              </Typography>

              {!isActive ? (
                <Button
                  variant="contained"
                  onClick={handleConnect}
                  sx={{
                    bgcolor: "#ffffff",
                    color: "#000000",
                    "&:hover": { bgcolor: "#cccccc" },
                    textTransform: "none",
                  }}
                >
                  เชื่อมต่อกระเป๋าสตางค์
                </Button>
              ) : (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDisconnect}
                    sx={{ textTransform: "none" }}
                  >
                    ยกเลิกการเชื่อมต่อ
                  </Button>
                </Stack>
              )}
            </Toolbar>
          </AppBar>
        </Box>

        <Container maxWidth="sm" sx={{ mt: 4 }}>
          {isActive && (
            <Card
              sx={{
                padding: 2,
                borderRadius: 3,
                boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
                bgcolor: "#f5f5f5",
              }}
            >
              <CardContent>
                <Stack spacing={3}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 500, color: "#333" }}
                  >
                    จองตั๋วภาพยนตร์ของคุณ
                  </Typography>
                  <TextField
                    label="ชื่อ-นามสกุล"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    variant="outlined"
                    error={error && !name}
                    helperText={error && !name ? "โปรดกรอกข้อมูลนี้" : ""}
                  />
                  <TextField
                    label="ข้อมูลติดต่อ"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    fullWidth
                    variant="outlined"
                    error={error && !contact}
                    helperText={error && !contact ? "โปรดกรอกข้อมูลนี้" : ""}
                  />
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={error && !cinema}
                  >
                    <InputLabel>โรงภาพยนตร์</InputLabel>
                    <Select
                      value={cinema}
                      onChange={(e) => setCinema(e.target.value)}
                      label="โรงภาพยนตร์"
                    >
                      {cinemas.map((cinemaItem) => (
                        <MenuItem key={cinemaItem.name} value={cinemaItem.name}>
                          {cinemaItem.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {error && !cinema && (
                      <Typography color="error" variant="caption">
                        โปรดกรอกข้อมูลนี้
                      </Typography>
                    )}
                  </FormControl>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={error && !movie}
                  >
                    <InputLabel>ภาพยนตร์</InputLabel>
                    <Select
                      value={movie}
                      onChange={handleMovieChange}
                      label="ภาพยนตร์"
                    >
                      {movies.map((movieItem) => (
                        <MenuItem key={movieItem.title} value={movieItem.title}>
                          {movieItem.title}
                        </MenuItem>
                      ))}
                    </Select>
                    {error && !movie && (
                      <Typography color="error" variant="caption">
                        โปรดกรอกข้อมูลนี้
                      </Typography>
                    )}
                  </FormControl>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={error && !showTime}
                  >
                    <InputLabel>รอบฉาย</InputLabel>
                    <Select
                      value={showTime}
                      onChange={(e) => setShowTime(e.target.value)}
                      label="รอบฉาย"
                    >
                      {availableShowtimes.map((showtime, index) => (
                        <MenuItem key={index} value={showtime}>
                          {showtime}
                        </MenuItem>
                      ))}
                    </Select>
                    {error && !showTime && (
                      <Typography color="error" variant="caption">
                        โปรดกรอกข้อมูลนี้
                      </Typography>
                    )}
                  </FormControl>
                  <TextField
                    label="จำนวนที่นั่ง"
                    type="number"
                    value={numSeats}
                    onChange={(e) => setNumSeats(e.target.value)}
                    fullWidth
                    variant="outlined"
                    error={error && !numSeats}
                    helperText={error && !numSeats ? "โปรดกรอกข้อมูลนี้" : ""}
                  />
                  <TextField
                    label="วันที่"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={error && !date}
                    helperText={error && !date ? "โปรดกรอกข้อมูลนี้" : ""}
                  />
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={error && !seatType}
                  >
                    <InputLabel>ประเภทที่นั่ง</InputLabel>
                    <Select
                      value={seatType}
                      onChange={(e) => setSeatType(e.target.value)}
                      label="ประเภทที่นั่ง"
                    >
                      <MenuItem value="ธรรมดา">ธรรมดา</MenuItem>
                      <MenuItem value="พิเศษ">พิเศษ</MenuItem>
                      <MenuItem value="วีไอพี">วีไอพี</MenuItem>
                    </Select>
                    {error && !seatType && (
                      <Typography color="error" variant="caption">
                        โปรดกรอกข้อมูลนี้
                      </Typography>
                    )}
                  </FormControl>

                  <Button
                    variant="contained"
                    onClick={handleBooking}
                    sx={{
                      bgcolor: "#000000",
                      color: "#ffffff",
                      "&:hover": { bgcolor: "#333333" },
                      textTransform: "none",
                    }}
                  >
                    จองตั๋ว
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Container>
      </Paper>
    </Box>
  );
}

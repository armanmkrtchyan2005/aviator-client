import { io } from "socket.io-client";

const URL = "https://5.45.65.88:8080";

const storedData = localStorage.getItem("token");

const token = storedData ? JSON.parse(storedData).token : null;

export const socket = token
    ? io(URL, {
          auth: {
              token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGM2MjcyNGVjYmE1MmRhZmU1YWIwMCIsImlhdCI6MTcwNDg5NjU0MiwiZXhwIjoxNzA1NTAxMzQyfQ.nQgKfYCzj-ITslTd6_DM0mGX0wFfXhAOoPncpD1Kl_8"
          }
      })
    : io(URL);

import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { useState, useEffect } from "react";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });
const interFontFace = `
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local('Inter Regular'), local('Inter-Regular'),
        url(${inter}) format('woff2');
  }
`;
const colors = [
  "#051e3e",
  "#251e3e",
  "#451e3e",
  "#651e3e",
  "#851e3e",
  "#283655",
]; // array of colors
const colorsBG = [
  "#a8e6cf70",
  "#dcedc170",
  "#ffd3b670",
  "#ffaaa570",
  "#ff8b9470",
  "#dfe3ee70",
]; // array of colors

export default function Home() {
  const [imageUrl, setImageUrl] = useState(
    "https://source.unsplash.com/random"
  );
  const [overlayStyle, setOverlayStyle] = useState({
    width: 500,
    height: 500,
  });
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState("");
  const [local, setLocal] = useState(1);

  useEffect(() => {
    const handleNewImage = () => {
      const newUrl = `https://source.unsplash.com/random/${Math.floor(
        Math.random() * 1000
      )}`;
      setImageUrl(newUrl);
    };

    // Call the getRandomImage function and set the state with the returned URL
    handleNewImage();
  }, []);

  useEffect(() => {
    function handleResize() {
      setOverlayStyle({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    handleResize();
  }, []);

  const generateQuote = async () => {
    try {
      if (localStorage.getItem("apiKey")) {
        const response = await axios.post(
          "http://localhost:4444/detox/generate",
          {
            "api-key": localStorage.getItem("apiKey"),
          }
        );
        console.log(response);
        setMessage(response.data.message);
        setOverlayStyle({
          ...overlayStyle,
          width: 0,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  if (typeof window !== "undefined") {
    window.onload = function () {
      // Your function code here
      generateQuote();
    };
  }
  const handleApiSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      if (!localStorage.getItem("apiKey")) {
        setLocal(1);
        const response = await axios.post(
          "http://localhost:4444/detox/generate",
          {
            "api-key": apiKey,
          }
        );
        localStorage.setItem("apiKey", apiKey);
        console.log(response);
        setMessage(response.data.message);
        setOverlayStyle({
          ...overlayStyle,
          width: 0,
        });
      } else {
        setLocal(0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const getRandomBGColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colorsBG[randomIndex];
  };

  return (
    <>
      <Head>
        <title>Detox Dopamine</title>
        <meta name="description" content="Generate Motivational Quotes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ position: "relative" }}>
        {imageUrl && (
          <div
            style={{
              position: "relative",
              width: "100vw",
              height: "100vh",
            }}
          >
            <img
              src={imageUrl}
              alt="random"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                width: overlayStyle.width,
                height: overlayStyle.height,
              }}
            />
            {local && (
              <form
                onSubmit={handleApiSubmit}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  animation: overlayStyle.width === 0 ? "fadeOut 2s" : "",
                  display: overlayStyle.width === 0 ? "none" : "",
                }}
              >
                <label htmlFor="api-key">Your OPENAI API Key:</label>
                <input
                  type="text"
                  id="api-key"
                  name="api-key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <button type="submit">Submit</button>
              </form>
            )}

            {message && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  animation: "fadeIn 2s",
                  backgroundColor: getRandomBGColor(),
                }}
              >
                <h1
                  style={{
                    fontSize: "7rem",
                    fontFamily: interFontFace,
                    fontWeight: 600,
                    color: getRandomColor(),
                    textAlign: "center",
                  }}
                >
                  {message}
                </h1>
              </div>
            )}
          </div>
        )}
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes fadeOut {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </>
  );
}

import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [emojiInput, setemojiInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emoji: emojiInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setemojiInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>EmojAI</title>
        <link rel="icon" href="/emoji4.png" />
      </Head>

      <center><h1>EmojAI  </h1></center>
      <center><h5> <img src="/emoji4.png" className={styles.icon} /></h5></center>
      <main className={styles.main}>
       
        <h3>Powered by world class AI</h3>
        <h6>Generate multiple emojis at once!</h6>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="emoji"
            placeholder="Enter text to emojify"
            value={emojiInput}
            onChange={(e) => setemojiInput(e.target.value)}
          />
          <input type="submit" value="Convert to Emojis" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}

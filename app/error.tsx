"use client";

type Props = {
  error: Error & { digest: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Props) {
  return (
    <div>
      <h2>ERROR : {error.stack || error.message}</h2>
      <pre style={{ color: "red" }}></pre>
      <button onClick={() => reset()}>Reset</button>
    </div>
  );
}

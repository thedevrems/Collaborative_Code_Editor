// Render the standard output and errors of the latest execution.
export default function OutputPanel({ running, result }) {
  return (
    <figure className="output-panel">
      <figcaption className="output-header">
        Output
        {running && <i className="output-running">running…</i>}
      </figcaption>
      <pre className="output-body">
        {result?.error && <strong className="output-error">{result.error}</strong>}
        {result?.timedOut && (
          <strong className="output-error">execution timed out</strong>
        )}
        {result?.stdout}
        {result?.stderr && <samp className="output-error">{result.stderr}</samp>}
      </pre>
    </figure>
  );
}

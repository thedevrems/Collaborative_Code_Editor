// Render the standard output and errors of the latest execution.
export default function OutputPanel({ running, result }) {
  return (
    <section className="output-panel">
      <div className="output-header">
        <span>Output</span>
        {running && <span className="output-running">running…</span>}
      </div>
      <pre className="output-body">
        {result?.error && <span className="output-error">{result.error}</span>}
        {result?.timedOut && (
          <span className="output-error">execution timed out</span>
        )}
        {result?.stdout}
        {result?.stderr && (
          <span className="output-error">{result.stderr}</span>
        )}
      </pre>
    </section>
  );
}

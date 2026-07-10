// Format a log line with an ISO timestamp and a severity level.
function format(level, message) {
  return `${new Date().toISOString()} [${level}] ${message}`;
}

export const logger = {
  info: (message) => console.log(format('INFO', message)),
  warn: (message) => console.warn(format('WARN', message)),
  error: (message) => console.error(format('ERROR', message)),
};

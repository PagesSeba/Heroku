import log4js from "log4js";

log4js.configure({
  appenders: {
    loggerConsole: { type: "console" },
    loggerWarn: { type: "file", filename: "warn.log" },
    loggerError: { type: "file", filename: "error.log" },
    miLoggerInfoConsole: {
      type: "logLevelFilter",
      appender: "loggerConsole",
      level: "info",
    },
    miLoggerArchivoWarn: {
      type: "logLevelFilter",
      appender: "loggerWarn",
      level: "warn",
    },
    miLoggerArchivoError: {
      type: "logLevelFilter",
      appender: "loggerError",
      level: "error",
    },
  },

  categories: {
    default: {
      appenders: [
        "miLoggerInfoConsole",
        "miLoggerArchivoWarn",
        "miLoggerArchivoError",
      ],
      level: "all",
    },
  },
});

let logger = log4js.getLogger();

export default logger;

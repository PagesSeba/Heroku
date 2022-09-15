const config = require ("../config.js");
const os = require("os")

const getInfo = (req, res) => {
  const info = {
    argumentos: Object.entries(config.ARG),
    SO: process.platform,
    v_node: process.version,
    rss: process.memoryUsage().rss,
    path: process.title,
    process_id: process.pid,
    carpeta_raiz: process.cwd(),
    cant_procesadores: os.cpus().length,
  };
  console.log(info);
  res.render("info", { info });
};

module.exports = { getInfo };

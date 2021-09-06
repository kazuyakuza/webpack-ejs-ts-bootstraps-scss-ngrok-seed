const getNgrokDomain = async () => {
  const http = require("http");
  const fetch = async (url) => {
    return new Promise((resolve, reject) => {
      http.get(url, (resp) => {
          let data = "";
          resp.on("data", (chunk) => {
            data += chunk;
          });
          resp.on("end", () => {
            resolve(data);
          });
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  };
  const {
    tunnels,
    uri
  } = JSON.parse(await fetch('http://127.0.0.1:4040/api/tunnels'));
  return tunnels[0].public_url;
}
module.exports = {
  getNgrokDomain
};

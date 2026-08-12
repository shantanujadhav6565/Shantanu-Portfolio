const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

dns.resolveSrv(
  "_mongodb._tcp.portfolio.ppkcivk.mongodb.net",
  (error, records) => {
    if (error) {
      console.error("DNS Error:");
      console.error(error);
      return;
    }

    console.log("\nMongoDB SRV Records:\n");

    records.forEach((record, index) => {
      console.log(`${index + 1}. ${record.name}:${record.port}`);
    });
  }
);
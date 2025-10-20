import oracledb from "oracledb";

declare global {
  var oraclePool: oracledb.Pool | undefined;
}

export async function getPool() {
  if (!global.oraclePool) {
    global.oraclePool = await oracledb.createPool({
      user: process.env.ORACLEDB_USER!,
      password: process.env.ORACLEDB_PASSWORD!,
      connectString: process.env.ORACLEDB_CONNECTIONSTRING!,
    });

    console.log("Oracle pool created");
  }

  return global.oraclePool;
}

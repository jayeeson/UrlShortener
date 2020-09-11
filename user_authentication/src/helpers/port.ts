const getPortIndex = (str: string) => {
  return process.argv.findIndex(element => element.toLocaleUpperCase().includes(str.toLocaleUpperCase()));
};

export function getPort(str: string, envVariable?: string): number | undefined {
  const portIndex = getPortIndex(str);
  const portArg = portIndex > -1 ? parseInt(process.argv[portIndex].substr(str.length), 10) : undefined;
  const portEnv = parseInt(`${envVariable}`, 10);

  if (portArg && !isNaN(portArg) && portArg > 0) {
    return portArg;
  } else if (!isNaN(portEnv) && portEnv > 0) {
    return portEnv;
  }
  return undefined;
}

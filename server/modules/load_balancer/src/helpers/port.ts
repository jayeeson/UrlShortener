const argStrings = {
  port: 'port=',
};

function getPortIndex(str: string) {
  return process.argv.findIndex(element => element.includes(str));
}

let tempPortIndex = getPortIndex(argStrings.port);
if (tempPortIndex === -1) {
  tempPortIndex = getPortIndex(argStrings.port.toLocaleUpperCase());
}

const portIndex = tempPortIndex;

export function getPort(): number {
  return portIndex > -1
    ? parseInt((process.argv[portIndex] as string).substr(5), 10)
    : parseInt(`${process.env.PORT}`, 10);
}

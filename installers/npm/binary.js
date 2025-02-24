const { Binary } = require("binary-install");
const os = require("os");
const cTable = require("console.table");

const error = (msg) => {
  console.error(msg);
  process.exit(1);
};

const { version } = require("./package.json");
const repository = "https://github.com/apollographql/rover";
const name = "rover";

const supportedPlatforms = [
  {
    TYPE: "Windows_NT",
    ARCHITECTURE: "x64",
    RUST_TARGET: "x86_64-pc-windows-msvc",
    BINARY_NAME: `${name}.exe`,
  },
  {
    TYPE: "Linux",
    ARCHITECTURE: "x64",
    RUST_TARGET: "x86_64-unknown-linux-gnu",
    BINARY_NAME: name,
  },
  {
    TYPE: "Darwin",
    ARCHITECTURE: "x64",
    RUST_TARGET: "x86_64-apple-darwin",
    BINARY_NAME: name,
  },
  {
    TYPE: "Darwin",
    ARCHITECTURE: "arm64",
    RUST_TARGET: "x86_64-apple-darwin",
    BINARY_NAME: name,
  },
];

const getPlatform = () => {
  const type = os.type();
  const architecture = os.arch();

  for (supportedPlatform of supportedPlatforms) {
    if (
      type === supportedPlatform.TYPE &&
      architecture === supportedPlatform.ARCHITECTURE
    ) {
      return supportedPlatform;
    }
  }

  error(
    `Platform with type "${type}" and architecture "${architecture}" is not supported by ${name}.\nYour system must be one of the following:\n\n${cTable.getTable(
      supportedPlatforms
    )}`
  );
};

const getBinary = () => {
  const platform = getPlatform();
  // the url for this binary is constructed from values in `package.json`
  // https://github.com/apollographql/rover/releases/download/v1.0.0/binary-install-example-v1.0.0-x86_64-apple-darwin.tar.gz
  const url = `${repository}/releases/download/v${version}/${name}-v${version}-${platform.RUST_TARGET}.tar.gz`;
  return new Binary(platform.BINARY_NAME, url);
};

const run = () => {
  const binary = getBinary();
  binary.run();
};

const install = () => {
  const binary = getBinary();
  binary.install();
};

module.exports = {
  install,
  run,
};

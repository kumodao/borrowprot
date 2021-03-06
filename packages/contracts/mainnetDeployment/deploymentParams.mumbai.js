const externalAddrs  = {
  // https://docs.chain.link/docs/matic-addresses/#Mumbai%20Testnet
  CHAINLINK_ETHUSD_PROXY: "0x0715A7794a1dc8e42615F059dD6e406A6594651A", 
  // https://docs.tellor.io/tellor/integration/reference
  TELLOR_MASTER:"0x41b66dd93b03e89D29114a7613A6f9f0d4F40178",
  // Below are SushiSwap addresses https://dev.sushi.com/sushiswap/contracts
  UNISWAP_V2_FACTORY: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  UNISWAP_V2_ROUTER02: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  // https://mumbai.polygonscan.com/token/0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa
  WETH_ERC20: "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa", 
}

const liquityAddrsTest = {
  GENERAL_SAFE:"0x8be7e24263c199ebfcfd6aebca83f8d7ed85a5dd",  // Hardhat dev address
  LQTY_SAFE:"0x20c81d658aae3a8580d990e441a9ef2c9809be74",  //  Hardhat dev address
  // LQTY_SAFE:"0x66aB6D9362d4F35596279692F0251Db635165871",
  DEPLOYER: "0x66aB6D9362d4F35596279692F0251Db635165871" // Mainnet test deployment address
}

const liquityAddrs = {
  GENERAL_SAFE:"0x3c198B7f3bA594804aEeA8894d0a58BCc345b8ce", // TODO
  LQTY_SAFE:"0xbFdECf1Db5c22d4CD3B0Bb970cF867BEFd2caE27", // TODO
  DEPLOYER: "0xdA68753F75AbFA16CdDf0596e4460636F2e8e986",
}

const beneficiaries = {
  TEST_INVESTOR_A: "0xdad05aa3bd5a4904eb2a9482757be5da8d554b3d",
  TEST_INVESTOR_B: "0x625b473f33b37058bf8b9d4c3d3f9ab5b896996a",
  TEST_INVESTOR_C: "0x9ea530178b9660d0fae34a41a02ec949e209142e",
  TEST_INVESTOR_D: "0xffbb4f4b113b05597298b9d8a7d79e6629e726e8",
  TEST_INVESTOR_E: "0x89ff871dbcd0a456fe92db98d190c38bc10d1cc1"
}

const OUTPUT_FILE = './mainnetDeployment/mumbaiDeploymentOutput.json'

const delay = ms => new Promise(res => setTimeout(res, ms));
const waitFunction = async () => {
  return delay(90000) // wait 90s
}

const GAS_PRICE = 7000000000 // 7 Gwei
const TX_CONFIRMATIONS = 1

const ETHERSCAN_BASE_URL = 'https://mumbai.polygonscan.com/address'

module.exports = {
  externalAddrs,
  liquityAddrs,
  beneficiaries,
  OUTPUT_FILE,
  waitFunction,
  GAS_PRICE,
  TX_CONFIRMATIONS,
  ETHERSCAN_BASE_URL,
};

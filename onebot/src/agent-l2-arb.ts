import {
  BlockEvent,
  Finding,
  HandleBlock,
  FindingSeverity,
  FindingType,
  getEthersProvider,
  ethers,
} from "forta-agent";
import { JsonRpcProvider } from "@ethersproject/providers";
import { DAI_L2_ADDRESS, ERC20_ABI } from "./constants";

let chainSpecificCache: number = 0;

async function getFindingsL2_ARB(
  erc20Abi: any[],
  daiL2Address: string
): Promise<Finding[]> {
  let provider: JsonRpcProvider = getEthersProvider();
  const findings: Finding[] = [];

  let DAI_L2 = new ethers.Contract(daiL2Address, erc20Abi, provider);
  let L2_totalSupply = parseFloat(await DAI_L2.totalSupply());
  console.log("ARB AGENT CALLED");
  if (chainSpecificCache != L2_totalSupply) {
    findings.push(
      Finding.fromObject({
        name: "(ARB)DAI-balance-update",
        description: `Returns the total supply of L2 Arbitrum DAI tokens`,
        alertId: "ARB_DAI_SUPPLY-1",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        protocol: "MakerDAO",
        metadata: {
          chainId: "42161",
          totalSupplyDAI: L2_totalSupply.toString(),
          prevTotalSupply: chainSpecificCache.toString(),
        },
      })
    );
    chainSpecificCache = L2_totalSupply;
  }

  return findings;
}

export default getFindingsL2_ARB(ERC20_ABI, DAI_L2_ADDRESS);

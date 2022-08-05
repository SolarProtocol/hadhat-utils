import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

export interface FormatMigrationOptions {
  contract: string;
  signature?: {
    abi: string;
    functionFragment: string;
  };
  args?: any[];
  from?: string;
  log?: boolean;
}

export async function formatMigration(
  hre: HardhatRuntimeEnvironment,
  options: FormatMigrationOptions
) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const { contract, signature, args, from, log } = options;

  const deployedContract = await deploy(contract, {
    from: from || deployer,
    log: log,
  });

  let data: string = '0x';
  if (signature) {
    const iface = new ethers.utils.Interface([signature.abi]);
    data = iface.encodeFunctionData(signature.functionFragment, args);
  }

  return {
    name: contract,
    contractAddress: deployedContract.address,
    data: data,
  };
}

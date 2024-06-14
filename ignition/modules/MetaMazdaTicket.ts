// npx hardhat ignition deploy ignition/modules/MetaMazdaTicket.ts --network zKyoto --verify
// npx hardhat ignition deploy ignition/modules/MetaMazdaTicket.ts --network astarZkEvm --verify
// npx hardhat ignition deploy ignition/modules/MetaMazdaTicket.ts --network hardhat

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MazdaModule = buildModule("MazdaModule", (m) => {
  const mazda = m.contract("MetaMazdaTicket", ["Meta-Mazda Ticket", "MAZDA"]);
  return { mazda };
});

export default MazdaModule;

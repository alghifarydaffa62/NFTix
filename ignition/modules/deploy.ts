import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import "@nomicfoundation/hardhat-ignition-ethers";
import "@nomicfoundation/hardhat-ignition"

export default buildModule("NFTIXModule", (m) => {
  const ticketNFT = m.contract("TicketNFT");

  const eventFactory = m.contract("EventFactory", [ticketNFT]);

  return { ticketNFT, eventFactory }
});

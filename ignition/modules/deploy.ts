import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("NFTIXModule", (m) => {
  const ticketNFT = m.contract("TicketNFT");

  const eventFactory = m.contract("EventFactory", {
    args: [ticketNFT],
  });

  return { ticketNFT, eventFactory }
});

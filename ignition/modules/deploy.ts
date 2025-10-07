import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("EventFactoryModule", (m) => {
  const eventFactory = m.contract("EventFactory");

  return { eventFactory }
});

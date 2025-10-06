const hre = require("hardhat")

async function main() {
  const EventFactory = await hre.ethers.getContractFactory("EventFactory")
  const eventFactory = await EventFactory.deploy()

  await eventFactory.waitForDeployment()
  console.log("EventFactory deployed to: ", await eventFactory.getAddress())
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
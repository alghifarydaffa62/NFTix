const { expect } = require("chai")
const { ethers } = require("hardhat")
const { time } = require("@nomicfoundation/hardhat-network-helpers")

describe("EventFactory", function() {
    let eventFactory;
    let organizer, buyer

    const futureDate = Math.floor(Date.now() / 1000) + 86400 * 30; 
    const deadline = Math.floor(Date.now() / 1000) + 86400 * 20;

    this.beforeEach(async function() {
        [organizer, buyer] = await ethers.getSigners()

        const EventFactory = await ethers.getContractFactory("EventFactory")
        eventFactory = await EventFactory.deploy()
        await eventFactory.waitForDeployment();
    })

    describe("Create Event", function() {
        it("Should create event successfully", async function () {
            const tx = await eventFactory.createEvent(
                "Bruno Mars Live",
                "Bruno first ever concert exclusive in Jakarta",
                "ipfs://QmTest123",
                futureDate,
                "JIS Tanjung Priok",
                2000,
                deadline
            )

            const receipt = await tx.wait()

            const event = await receipt.events[0].args
            expect(event.name).to.equal("Bruno Mars Live")
            expect(event.organizer).to.equal(organizer.address);
            expect(event.active).to.be.true;
        })

        it("Should increment event id", async function() {
            await eventFactory.createEvent(
                "Event 1", "Desc...", "ipfs://1", futureDate, "Venue", 100, deadline
            )
            await eventFactory.createEvent(
                "Event 2", "Desc...", "ipfs://2", futureDate, "Venue", 200, deadline
            )

            const total = await eventFactory.getTotalEvent()
            expect(total).to.equal(2)

            const event1 = await eventFactory.getEvent(ethers.toBigInt(0))
            const event2 = await eventFactory.getEvent(ethers.toBigInt(1))

            expect(event1.name).to.equal("Event 1")
            expect(event2.name).to.equal("Event 2")
        })

        it("Should track organizer's event", async function() {
            await eventFactory.createEvent(
                "Event 1", "Desc...", "ipfs://1", futureDate, "Venue", 100, deadline
            )
            await eventFactory.createEvent(
                "Event 2", "Desc...", "ipfs://2", futureDate, "Venue", 200, deadline
            )

            const organizerEvents = await eventFactory.getOrganizerEvent(organizer.address)
            expect(organizerEvents.length).to.equal(2)
            expect(organizerEvents[0]).to.equal(0);
            expect(organizerEvents[1]).to.equal(1);
        })

        it("Should reject empty name", async function() {
            await expect(
                eventFactory.createEvent(
                "", "Desc...", "ipfs://1", futureDate, "Venue", 100, deadline
                )
            ).to.be.revertedWith("Invalid Event Name!");
        });
        
        it("Should reject short description", async function() {
            await expect(
                eventFactory.createEvent(
                "Event", "Short", "ipfs://1", futureDate, "Venue", 100, deadline
                )
            ).to.be.revertedWith("Event Description must more than 10 chars!");
        });
        
        it("Should reject past date", async function() {
            const pastDate = Math.floor(Date.now() / 1000) - 86400; 
            
            await expect(
                eventFactory.createEvent(
                "Event", "Description...", "ipfs://1", pastDate, "Venue", 100, deadline
                )
            ).to.be.revertedWith("Invalid Event date!");
        });
        
        it("Should reject deadline after event date", async function() {
            const eventDate = Math.floor(Date.now() / 1000) + 86400 * 10;
            const badDeadline = Math.floor(Date.now() / 1000) + 86400 * 15;
            
            await expect(
                eventFactory.createEvent(
                "Event", "Description...", "ipfs://1", eventDate, "Venue", 100, badDeadline
                )
            ).to.be.revertedWith("Invalid Event deadline");
        });
    })
})
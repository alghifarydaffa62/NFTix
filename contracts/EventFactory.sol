// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "./TicketNFT.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract EventFactory {
    struct Event {
        uint id;
        string name;
        string desc;
        string imageURI;
        uint date;
        string venue;
        address organizer;
        uint maxParticipant;
        uint deadline;
        uint totalRevenue;
        bool active;
        address ticketContract;
    }

    struct CreateEventParams {
        string name;
        string desc;
        string imageURI;
        uint date;
        string venue;
        uint maxParticipant;
        uint deadline;
        TicketNFT.TicketTier[] tiers;
    }

    address public immutable ticketImplementation;
    Event[] public events;
    mapping(address => uint[]) public organizerEvents;
    uint private eventIDCounter;

    event EventCreated(
        uint indexed eventId,
        string indexed eventName, 
        address indexed eventOrganizer, 
        uint date, 
        address ticketContract
    );
    event EventUpdated(uint indexed eventId, string indexed eventName);

    modifier onlyOrganizer(uint _eventId) {
        require(events[_eventId].organizer == msg.sender, "You are not the organizer of this Event!");
        _;
    }

    modifier validEventId(uint _eventId) {
        require(_eventId < events.length, "Invalid eventID!");
        _;
    }

    constructor(address _ticketImplementation) {
        ticketImplementation = _ticketImplementation;
    }

    function createEvent(
        CreateEventParams calldata params
    ) public returns (uint eventId) {
        require(bytes(params.name).length > 0, "Invalid Event Name!");
        require(bytes(params.desc).length > 10, "Event Description must more than 10 chars!");
        require(bytes(params.venue).length > 3, "Invalid Event Venue!");
        require(params.date > block.timestamp, "Invalid Event date!");
        require(params.maxParticipant > 0, "Invalid max participant!");
        require(params.deadline < params.date, "Invalid Event deadline");

        address cloneAddress = Clones.clone(ticketImplementation);

        TicketNFT newTicketContract = TicketNFT(cloneAddress);

        newTicketContract.initialize(
            msg.sender,
            address(this),
            eventIDCounter,
            params.name,
            params.desc,
            params.venue,
            params.date
        );

        newTicketContract.addTiers(params.tiers);

        Event memory newEvent = Event({
            id: eventIDCounter,
            name: params.name,
            desc: params.desc,
            imageURI: params.imageURI,
            date: params.date,
            venue: params.venue,
            organizer: msg.sender,
            maxParticipant: params.maxParticipant,
            deadline: params.deadline,
            totalRevenue: 0,
            active: true,
            ticketContract: cloneAddress
        });

        events.push(newEvent);
        organizerEvents[msg.sender].push(eventIDCounter);
        emit EventCreated(eventIDCounter, params.name, msg.sender, params.date, cloneAddress);

        eventId = eventIDCounter;
        eventIDCounter++;

        return eventId;
    }

    function setTicketContract(
        uint256 _eventId,
        address _ticketContract
    ) 
        public 
        validEventId(_eventId) 
        onlyOrganizer(_eventId) 
    {
        require(_ticketContract != address(0), "Invalid contract address");
        require(
            events[_eventId].ticketContract == address(0),
            "Ticket contract already set"
        );
        
        events[_eventId].ticketContract = _ticketContract;
    }

    function updateEvent(
        uint _eventId,
        string memory _name,
        string memory _desc,
        string memory _imageURI
    ) public onlyOrganizer(_eventId){
        require(bytes(_name).length > 0, "Invalid name update");
        require(bytes(_desc).length > 10, "Invalid description update");

        events[_eventId].name = _name;
        events[_eventId].desc = _desc;
        events[_eventId].imageURI = _imageURI;

        emit EventUpdated(_eventId, _name);
    }

    function recordRevenue(uint256 _eventId, uint256 _amount) 
        external 
        validEventId(_eventId) 
    {
        require(
            msg.sender == events[_eventId].ticketContract,
            "Only ticket contract can record revenue"
        );
        
        events[_eventId].totalRevenue += _amount;
    }

    function getAllEvents() public view returns(Event[] memory) {
        return events;
    }

    function getActiveEvents() public view returns(Event[] memory) {
        uint activeCount = 0;
        for(uint i = 0; i < events.length; i++) {
            if(events[i].active && block.timestamp < events[i].deadline) {
                activeCount++;
            }
        }

        Event[] memory activeEvents = new Event[](activeCount);
        uint index = 0;

        for(uint i = 0; i < events.length; i++) {
            if(events[i].active && block.timestamp < events[i].deadline) {
                activeEvents[index] = events[i];
                index++;
            }
        }

        return activeEvents;
    }

    function getEventsByOrganizer(address _organizer) public view returns (Event[] memory) {
        uint[] memory eventIds = organizerEvents[_organizer];
        Event[] memory organizerEventDetails = new Event[](eventIds.length);

        for (uint i = 0; i < eventIds.length; i++) {
            uint eventId = eventIds[i];
            organizerEventDetails[i] = events[eventId];
        }

        return organizerEventDetails;
    }

    function getOrganizerEvent(address _organizer) public view returns(uint[] memory) {
        return organizerEvents[_organizer];
    }

    function getEvent(uint _eventId) public view returns(Event memory) {
        return events[_eventId];
    }

    function getTotalEvent() public view returns(uint) {
        return events.length;
    }

    function isEventActive(uint256 _eventId) 
        public 
        view 
        validEventId(_eventId) 
        returns (bool) 
    {
        Event memory eventData = events[_eventId];
        return eventData.active && 
                block.timestamp < eventData.deadline &&
                block.timestamp < eventData.date;
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract TicketNFT is ERC721, Ownable, ReentrancyGuard {
    using Strings for uint256;

    uint256 public constant MAX_PER_WALLET = 3;
    uint256 public constant LOCK_PERIOD_SECONDS = 2 days; 

    struct TicketTier {
        string name;
        uint price;
        uint maxSupply;
        uint sold;
    }

    struct Ticket {
        uint id;
        string tier;
        uint originalPrice;
        bool used;
        uint purchaseTimestamp;
    }

    uint256 private _tokenIdCounter;
    uint256 public eventId; 

    address public factory;
    uint public eventDate;

    TicketTier[] public tiers;
    
    bool public tiersSet = false;

    mapping(uint256 => Ticket) public tickets;
    mapping(address => uint256) public purchasedCount;
    mapping(uint256 => string) private _tokenURIs;
    string public eventTitle;
    string public eventInfo;
    string public eventVenue;
    bool public saleActive = true;
    bool public eventEnded = false;

    event TicketsPurchased(address indexed buyer, uint[] tokenIds, uint tierIndex, uint quantity);
    event TicketUsed(uint indexed tokenId, address indexed user, uint timestamp);
    event TicketBurned(uint indexed tokenId);
    event FactoryChanged(address indexed oldFactory, address indexed newFactory);
    event LockPeriodChanged(uint256 oldPeriod, uint256 newPeriod);
    event SaleStatusChanged(bool active);
    event Withdrawn(address indexed to, uint256 amount);


    modifier whenSaleActive() {
        require(saleActive, "sale not active!");
        _;
    }

    modifier onlyFactory() {
        require(msg.sender == factory, "Only factory can call this");
        _;
    }

    constructor() ERC721("NFTix Ticket", "NFTIX") Ownable(msg.sender) {}

    function initialize(
        address _organizer,
        address _factory,
        uint _eventId,
        string memory _eventTitle,
        string memory _eventInfo,
        string memory _eventVenue,
        uint256 _eventDate
    ) external {
        require(owner() == address(0), "Already initialized");
        _transferOwnership(_organizer);

        factory = _factory;
        eventId = _eventId;
        eventTitle = _eventTitle;
        eventVenue = _eventVenue;
        eventDate = _eventDate;
        eventInfo = _eventInfo;
        saleActive = true;
    }
    
    function addTiers(TicketTier[] memory _tiers) external onlyFactory {
        require(!tiersSet, "Tiers have already been set");
        for (uint i = 0; i < _tiers.length; i++) {
            tiers.push(_tiers[i]);
        }
        tiersSet = true;
    }

    function buyTicket(uint tierIndex, uint quantity) 
        external 
        payable 
        nonReentrant 
        whenSaleActive 
        returns(uint[] memory) 
    {
        require(tiersSet, "Tickets are not ready for sale yet");

        require(purchasedCount[msg.sender] + quantity <= MAX_PER_WALLET, "Exceed ticket buy limit per wallet (max 3)");
        require(tierIndex < tiers.length, "Invalid tier");
        require(block.timestamp < eventDate, "Event closed");

        TicketTier storage tier = tiers[tierIndex];
        require(tier.sold + quantity <= tier.maxSupply, "Tier sold out");

        uint totalPrice = tier.price * quantity;
        require(msg.value >= totalPrice, "Insufficient payment amount");

        uint[] memory newTokenIds = new uint[](quantity);

        for (uint i = 0; i < quantity; i++) {
            uint256 tokenId = _tokenIdCounter++;
            _safeMint(msg.sender, tokenId);
            
            tickets[tokenId] = Ticket({
                id: tokenId,
                tier: tier.name,
                originalPrice: tier.price,
                used: false,
                purchaseTimestamp: block.timestamp
            });
            
            newTokenIds[i] = tokenId;
        }

        unchecked {
            purchasedCount[msg.sender] += quantity;
            tier.sold += quantity;
        }

        _recordRevenue(totalPrice);

        if (msg.value > totalPrice) {
            (bool success, ) = payable(msg.sender).call{value: msg.value - totalPrice}("");
            require(success, "Refund failed");
        }
        
        emit TicketsPurchased(msg.sender, newTokenIds, tierIndex, quantity);
        return newTokenIds;
    }

    function markAsUsed(uint256 tokenId) external onlyOwner {
        Ticket storage ticket = tickets[tokenId];
        require(!ticket.used, "Ticket already used");
        uint eventEnd = eventDate + 12 hours; 
        require(block.timestamp >= eventDate && block.timestamp <= eventEnd, "Check-in window is not active");
        ticket.used = true;
        emit TicketUsed(tokenId, ownerOf(tokenId), block.timestamp);
    }

    function verifyTicket(uint tokenId) 
        external 
        view 
        returns(
            bool isValid, 
            address currentOwner, 
            string memory tier, 
            bool used, 
            string memory reason
    ) {
        try this.ownerOf(tokenId) returns (address owner) {
            currentOwner = owner;
            Ticket memory ticket = tickets[tokenId];

            if (ticket.used) {
                return(false, currentOwner, ticket.tier, true, "Already used");
            } 

            if (block.timestamp < eventDate - 1 days) {
                return (false, currentOwner, ticket.tier, false, "Too early - not event day");
            }
            
            if (block.timestamp > eventDate + 2 days) {
                return (false, currentOwner, ticket.tier, false, "Event already ended");
            }

            return (true, currentOwner, ticket.tier, false, "Valid");
        } catch {
            return (false, address(0), "", false, "Token does not exist");
        }
    }

    function setTokenURI(uint tokenId, string calldata uri) external {
        require(msg.sender == ownerOf(tokenId), "Not Authorized!");
        _tokenURIs[tokenId] = uri;
    }

    function setTokenURIBatch(uint[] calldata tokenIds, string[] calldata uris) external onlyOwner {
        require(tokenIds.length == uris.length, "Length mismatch");
        
        for (uint i = 0; i < tokenIds.length; i++) {
            _tokenURIs[tokenIds[i]] = uris[i];
        }
    }

    function setFactory(address newFactory) external onlyOwner {
        require(newFactory != address(0), "Invalid factory address!");
        address old = factory;
        factory = newFactory;
        emit FactoryChanged(old, newFactory);
    }

    function endEvent() external onlyOwner {
        eventEnded = true;
    }

    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Transfer failed");
        
        emit Withdrawn(owner(), balance);
    }

    function withdrawTo(address payable recipient) external onlyOwner nonReentrant {
        require(recipient != address(0), "Invalid address");
        
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds");
        
        (bool success, ) = recipient.call{value: balance}("");
        require(success, "Transfer failed");
        
        emit Withdrawn(recipient, balance);
    }

    function burn(uint256 tokenId) external onlyOwner {
        address tokenOwner = ownerOf(tokenId);
        
        _burn(tokenId);
        
        if (purchasedCount[tokenOwner] > 0) {
            unchecked {
                purchasedCount[tokenOwner]--;
            }
        }
        
        delete tickets[tokenId];
        
        emit TicketBurned(tokenId);
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }

    function maxSupply() public view returns (uint256) {
        uint256 total = 0;
        for (uint i = 0; i < tiers.length; i++) {
            total += tiers[i].maxSupply;
        }
        return total;
    }

    function getTier(uint256 tierIndex) external view returns (TicketTier memory) {
        require(tierIndex < tiers.length, "Invalid tier");
        return tiers[tierIndex];
    }

    function getAllTiers() external view returns (TicketTier[] memory) {
        return tiers;
    }

    function isLocked(uint256 tokenId) public view returns (bool) {
        _requireOwned(tokenId);
        uint256 ts = tickets[tokenId].purchaseTimestamp;
        if (ts == 0) return false;

        return block.timestamp < (ts + LOCK_PERIOD_SECONDS);
    }

    function remainingLockSeconds(uint256 tokenId) external view returns (uint256) {
        _requireOwned(tokenId);
        uint256 ts = tickets[tokenId].purchaseTimestamp;
        if (ts == 0) return 0;

        uint256 unlockAt = ts + LOCK_PERIOD_SECONDS;
        if (block.timestamp >= unlockAt) return 0;
        
        return unlockAt - block.timestamp;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        
        string memory uri = _tokenURIs[tokenId];

        if (bytes(uri).length > 0) {
            return uri;
        }

        return string(abi.encodePacked("ipfs://", tokenId.toString()));
    }

    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokens = new uint256[](balance);
        uint256 index = 0;
        
        for (uint256 i = 0; i < _tokenIdCounter && index < balance; i++) {
            try this.ownerOf(i) returns (address tokenOwner) {
                if (tokenOwner == owner) {
                    tokens[index++] = i;
                }
            } catch {
                continue;
            }
        }
        
        return tokens;
    }

    function _update(address to, uint256 tokenId, address auth) 
        internal 
        override 
        returns (address) 
    {
        address from = _ownerOf(tokenId);

        if (from != address(0) && to != address(0)) {
            require(!isLocked(tokenId), "Token locked!");
        }
        
        return super._update(to, tokenId, auth);
    }

    function _recordRevenue(uint256 amount) internal {
        (bool success, ) = factory.call(
            abi.encodeWithSignature("recordRevenue(uint256,uint256)", eventId, amount)
        );
        require(success, "Revenue record failed");
    }
}
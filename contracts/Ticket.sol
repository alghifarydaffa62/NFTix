// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TicketNFT is ERC721, Ownable, ReentrancyGuard {

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
        string seatNumber;
        bool used;
        uint purchaseTimestamp;
    }

    uint256 private _tokenIdCounter;

    address public factory;
    uint256 public immutable maxPerWallet;
    uint256 public lockPeriod;
    uint public eventDate;

    TicketTier[] public tiers;

    mapping(uint256 => Ticket) public tickets;
    mapping(uint256 => uint256) public purchaseTimestamp;
    mapping(address => uint256) public purchasedCount;
    mapping(uint256 => string) private _tokenURIs;

    string public eventTitle;
    string public eventInfo;
    string public eventVenue;

    bool public saleActive = true;
    bool public eventEnded = false;

    // Events
    event TicketsPurchased(address indexed buyer, uint[] tokenIds, uint tierIndex, uint quantity);
    event TicketUsed(uint indexed tokenId, address indexed user, uint timestamp);
    event TicketBurned(uint indexed tokenId);
    event FactoryChanged(address indexed oldFactory, address indexed newFactory);
    event LockPeriodChanged(uint256 oldPeriod, uint256 newPeriod);
    event SaleStatusChanged(bool active);
    event Withdrawn(address indexed to, uint256 amount);

    modifier onlyFactory() {
        require(msg.sender == factory, "TicketNFT: only factory");
        _;
    }

    modifier whenSaleActive() {
        require(saleActive, "sale not active!");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _maxPerWallet,
        address _factory,
        string memory _eventTitle,
        string memory _eventInfo,
        string memory _eventVenue,
        uint256 _eventDate,
        uint256 _lockPeriodSeconds,
        TicketTier[] memory _tiers
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        require(_factory != address(0), "factory required");
        require(_maxPerWallet > 0, "Max Per Wallet should be more than 0");

        factory = _factory;
        maxPerWallet = _maxPerWallet;
        eventTitle = _eventTitle;
        eventVenue = _eventVenue;
        eventDate = _eventDate;
        eventInfo = _eventInfo;
        lockPeriod = _lockPeriodSeconds == 0 ? 172800 : _lockPeriodSeconds; // 48h default

        for (uint i = 0; i < _tiers.length; i++) {
            tiers.push(_tiers[i]);
        }
    }

    function buyTicket(uint tierIndex, uint quantity) external payable nonReentrant whenSaleActive returns(uint[] memory) {
        require(quantity <= maxPerWallet, "Exceed ticket buy limit");
        require(tierIndex >= tiers.length, "Invalid tier");

        TicketTier storage tier = tiers[tierIndex];

        uint totalPrice = tier.price * quantity;
        require(msg.value == totalPrice, "Invalid payment amount");

        uint memory newTokenIds = new uint[](quantity);

        for (uint i = 0; i < quantity; i++) {
            uint256 tokenId = _tokenIdCounter++;
            
            _safeMint(msg.sender, tokenId);
            
            // Generate seat number
            string memory seatNumber = _generateSeatNumber(tier.name, tier.sold + i + 1);
            
            tickets[tokenId] = Ticket({
                id: tokenId,
                tier: tier.name,
                originalPrice: tier.price,
                seatNumber: seatNumber,
                used: false,
                purchaseTimestamp: block.timestamp
            });
            
            purchaseTimestamp[tokenId] = block.timestamp;
            newTokenIds[i] = tokenId;
        }

        unchecked {
            purchasedCount[msg.sender] += quantity;
            tier.sold += quantity;
        }

        if (msg.value > totalPrice) {
            (bool success, ) = payable(msg.sender).call{value: msg.value - totalPrice}("");
            require(success, "Refund failed");
        }
        
        emit TicketsPurchased(msg.sender, newTokenIds, tierIndex, quantity);
        return newTokenIds;
    }

    // function markAsUsed(uint tokenId) external onlyOwner {
    //     _requireOwned(tokenId);

    //     Ticket storage
    // }

    function mintTo(address to, string calldata uri) external onlyFactory returns (uint256) {
        require(to != address(0), "Invalid target address");
        require(purchasedCount[to] + 1 <= maxPerWallet, "Exceeds max per wallet");

        _tokenIdCounter.increment();
        uint256 newId = _tokenIdCounter.current();

        _safeMint(to, newId);

        _tokenURIs[newId] = uri;

        purchaseTimestamp[newId] = block.timestamp;

        purchasedCount[to] += 1;

        emit TicketMinted(to, newId, uri);
        return newId;
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function setFactory(address newFactory) external onlyOwner {
        require(newFactory != address(0), "Invalid factory");
        address old = factory;
        factory = newFactory;
        emit FactoryChanged(old, newFactory);
    }

    function setLockPeriod(uint256 newLockPeriod) external onlyOwner {
        emit LockPeriodChanged(lockPeriod, newLockPeriod);
        lockPeriod = newLockPeriod;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Nonexistent token");
        string memory uri = _tokenURIs[tokenId];
        return uri;
    }

    function isLocked(uint256 tokenId) public view returns (bool) {
        require(_exists(tokenId), "Nonexistent token");
        uint256 ts = purchaseTimestamp[tokenId];
        if (ts == 0) return false;
        return block.timestamp < (ts + lockPeriod);
    }

    function remainingLockSeconds(uint256 tokenId) external view returns (uint256) {
        require(_exists(tokenId), "Nonexistent token");
        uint256 ts = purchaseTimestamp[tokenId];
        if (ts == 0) return 0;
        uint256 unlockAt = ts + lockPeriod;
        if (block.timestamp >= unlockAt) return 0;
        return unlockAt - block.timestamp;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override virtual {
        super._beforeTokenTransfer(from, to, tokenId);

        if (from != address(0) && to != address(0)) {
            uint256 ts = purchaseTimestamp[tokenId];
            if (ts != 0) {
                require(block.timestamp >= ts + lockPeriod, "TicketNFT: token locked");
            }
        }
    }

    function burn(uint256 tokenId) external onlyOwner {
        address ownerOfToken = ownerOf(tokenId);
        _burn(tokenId);

        if (purchasedCount[ownerOfToken] > 0) {
            purchasedCount[ownerOfToken] -= 1;
        }

        if (purchaseTimestamp[tokenId] != 0) {
            purchaseTimestamp[tokenId] = 0;
        }
        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
    }


    function getEventInfo() external view returns (
        string memory _title,
        string memory _info,
        uint256 _maxSupply,
        uint256 _sold,
        uint256 _maxPerWalletLocal,
        uint256 _lockPeriod
    ) {
        _title = eventTitle;
        _info = eventInfo;
        _maxSupply = maxSupply;
        _sold = totalSupply();
        _maxPerWalletLocal = maxPerWallet;
        _lockPeriod = lockPeriod;
    }

    receive() external payable {
        revert("TicketNFT: no direct payments");
    }

}

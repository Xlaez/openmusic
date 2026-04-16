// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title OpenMusicNFT
 * @notice ERC-721 contract for a single music project (album/EP/single/mixtape).
 *         Each project gets its own instance deployed by the OpenMusicFactory.
 *         On purchase, ETH is split 50/50 between artist and platform.
 */
contract OpenMusicNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    uint256 public maxSupply;
    uint256 public availableSupply;
    uint256 public priceInWei;
    address public artist;
    address public platform;
    string public projectURI;

    event Minted(address indexed buyer, uint256 indexed tokenId, uint256 price);

    /**
     * @param _name        NFT collection name (project title)
     * @param _symbol      NFT collection symbol
     * @param _maxSupply   Maximum number of NFTs that can be minted
     * @param _priceInWei  Price per mint in wei
     * @param _artist      Artist wallet address (receives 50% of sales)
     * @param _platform    Platform wallet address (receives 50% of sales)
     * @param _projectURI  Metadata URI for the project
     */
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply,
        uint256 _priceInWei,
        address _artist,
        address _platform,
        string memory _projectURI
    ) ERC721(_name, _symbol) Ownable(_platform) {
        require(_maxSupply >= 3, "Max supply must be at least 3");
        require(_artist != address(0), "Invalid artist address");
        require(_platform != address(0), "Invalid platform address");

        maxSupply = _maxSupply;
        priceInWei = _priceInWei;
        artist = _artist;
        platform = _platform;
        projectURI = _projectURI;

        // Mint 2 reserved tokens to platform
        _mintInternal(_platform);
        _mintInternal(_platform);

        // Available supply excludes the 2 reserved tokens
        availableSupply = _maxSupply - 2;
    }

    /**
     * @notice Mint a new NFT to the specified address. Must send exact price in ETH.
     * @param to The address to mint the NFT to
     */
    function mint(address to) external payable {
        require(availableSupply > 0, "Sold out");
        require(msg.value >= priceInWei, "Insufficient payment");
        require(to != address(0), "Invalid recipient");

        availableSupply--;

        uint256 tokenId = _mintInternal(to);

        // Split payment 50/50 between artist and platform
        uint256 artistShare = msg.value / 2;
        uint256 platformShare = msg.value - artistShare;

        (bool sentArtist, ) = payable(artist).call{value: artistShare}("");
        require(sentArtist, "Artist payment failed");

        (bool sentPlatform, ) = payable(platform).call{value: platformShare}("");
        require(sentPlatform, "Platform payment failed");

        emit Minted(to, tokenId, msg.value);
    }

    /**
     * @notice Platform-only mint (for promotional/reserved purposes)
     * @param to The address to mint the NFT to
     */
    function platformMint(address to) external onlyOwner {
        require(availableSupply > 0, "Sold out");
        availableSupply--;
        _mintInternal(to);
    }

    function _mintInternal(address to) private returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, projectURI);
        return tokenId;
    }

    /**
     * @notice Get the total number of minted tokens
     */
    function totalMinted() external view returns (uint256) {
        return _nextTokenId;
    }

    // Required overrides for ERC721URIStorage
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

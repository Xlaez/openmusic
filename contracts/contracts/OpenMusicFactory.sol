// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./OpenMusicNFT.sol";

/**
 * @title OpenMusicFactory
 * @notice Factory contract that deploys a new OpenMusicNFT for each music project.
 *         Only the platform address can create new projects.
 */
contract OpenMusicFactory {
    address public platform;
    uint256 public projectCount;

    struct ProjectInfo {
        address nftContract;
        address artist;
        string name;
        uint256 maxSupply;
        uint256 priceInWei;
    }

    mapping(uint256 => ProjectInfo) public projects;
    mapping(address => uint256) public contractToProjectId;

    event ProjectCreated(
        uint256 indexed projectId,
        address indexed nftContract,
        address indexed artist,
        string name,
        uint256 maxSupply,
        uint256 priceInWei
    );

    modifier onlyPlatform() {
        require(msg.sender == platform, "Only platform can call this");
        _;
    }

    constructor() {
        platform = msg.sender;
    }

    /**
     * @notice Deploy a new OpenMusicNFT contract for a music project
     * @param _name        Project/collection name
     * @param _symbol      Collection symbol
     * @param _maxSupply   Max NFT supply
     * @param _priceInWei  Price per mint in wei
     * @param _artist      Artist wallet address
     * @param _projectURI  Metadata URI for the project
     * @return nftAddress  The deployed NFT contract address
     */
    function createProject(
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply,
        uint256 _priceInWei,
        address _artist,
        string memory _projectURI
    ) external onlyPlatform returns (address nftAddress) {
        OpenMusicNFT nft = new OpenMusicNFT(
            _name,
            _symbol,
            _maxSupply,
            _priceInWei,
            _artist,
            platform,
            _projectURI
        );

        nftAddress = address(nft);
        uint256 projectId = projectCount;
        projectCount++;

        projects[projectId] = ProjectInfo({
            nftContract: nftAddress,
            artist: _artist,
            name: _name,
            maxSupply: _maxSupply,
            priceInWei: _priceInWei
        });

        contractToProjectId[nftAddress] = projectId;

        emit ProjectCreated(
            projectId,
            nftAddress,
            _artist,
            _name,
            _maxSupply,
            _priceInWei
        );

        return nftAddress;
    }

    /**
     * @notice Get project info by ID
     */
    function getProject(uint256 _projectId) external view returns (ProjectInfo memory) {
        require(_projectId < projectCount, "Project does not exist");
        return projects[_projectId];
    }

    /**
     * @notice Get the total number of projects created
     */
    function getProjectCount() external view returns (uint256) {
        return projectCount;
    }
}

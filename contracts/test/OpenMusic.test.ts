import { expect } from "chai";
import { ethers } from "hardhat";
import { OpenMusicFactory, OpenMusicNFT } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("OpenMusic Contracts", function () {
  let factory: OpenMusicFactory;
  let platform: SignerWithAddress;
  let artist: SignerWithAddress;
  let buyer: SignerWithAddress;
  let buyer2: SignerWithAddress;

  const PROJECT_NAME = "GRIME&ELECTRONIC";
  const PROJECT_SYMBOL = "GRIME";
  const MAX_SUPPLY = 100;
  const PRICE = ethers.parseEther("0.01"); // 0.01 ETH
  const PROJECT_URI = "https://openmusic.io/metadata/1";

  beforeEach(async function () {
    [platform, artist, buyer, buyer2] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("OpenMusicFactory");
    factory = await Factory.deploy();
    await factory.waitForDeployment();
  });

  describe("OpenMusicFactory", function () {
    it("should set platform address on deploy", async function () {
      expect(await factory.platform()).to.equal(platform.address);
    });

    it("should create a new project", async function () {
      const tx = await factory.createProject(
        PROJECT_NAME,
        PROJECT_SYMBOL,
        MAX_SUPPLY,
        PRICE,
        artist.address,
        PROJECT_URI
      );

      const receipt = await tx.wait();
      expect(await factory.projectCount()).to.equal(1);

      const projectInfo = await factory.getProject(0);
      expect(projectInfo.artist).to.equal(artist.address);
      expect(projectInfo.name).to.equal(PROJECT_NAME);
      expect(projectInfo.maxSupply).to.equal(MAX_SUPPLY);
      expect(projectInfo.priceInWei).to.equal(PRICE);
      expect(projectInfo.nftContract).to.not.equal(ethers.ZeroAddress);
    });

    it("should emit ProjectCreated event", async function () {
      await expect(
        factory.createProject(
          PROJECT_NAME,
          PROJECT_SYMBOL,
          MAX_SUPPLY,
          PRICE,
          artist.address,
          PROJECT_URI
        )
      ).to.emit(factory, "ProjectCreated");
    });

    it("should only allow platform to create projects", async function () {
      await expect(
        factory
          .connect(artist)
          .createProject(
            PROJECT_NAME,
            PROJECT_SYMBOL,
            MAX_SUPPLY,
            PRICE,
            artist.address,
            PROJECT_URI
          )
      ).to.be.revertedWith("Only platform can call this");
    });

    it("should create multiple projects with incrementing IDs", async function () {
      await factory.createProject(
        "Project 1",
        "P1",
        50,
        PRICE,
        artist.address,
        PROJECT_URI
      );
      await factory.createProject(
        "Project 2",
        "P2",
        75,
        PRICE,
        artist.address,
        PROJECT_URI
      );

      expect(await factory.projectCount()).to.equal(2);

      const p1 = await factory.getProject(0);
      const p2 = await factory.getProject(1);
      expect(p1.name).to.equal("Project 1");
      expect(p2.name).to.equal("Project 2");
    });
  });

  describe("OpenMusicNFT", function () {
    let nft: OpenMusicNFT;
    let nftAddress: string;

    beforeEach(async function () {
      const tx = await factory.createProject(
        PROJECT_NAME,
        PROJECT_SYMBOL,
        MAX_SUPPLY,
        PRICE,
        artist.address,
        PROJECT_URI
      );

      const receipt = await tx.wait();
      const projectInfo = await factory.getProject(0);
      nftAddress = projectInfo.nftContract;
      nft = await ethers.getContractAt("OpenMusicNFT", nftAddress);
    });

    it("should mint 2 reserved tokens to platform on deploy", async function () {
      expect(await nft.totalMinted()).to.equal(2);
      expect(await nft.ownerOf(0)).to.equal(platform.address);
      expect(await nft.ownerOf(1)).to.equal(platform.address);
    });

    it("should set correct initial state", async function () {
      expect(await nft.maxSupply()).to.equal(MAX_SUPPLY);
      expect(await nft.availableSupply()).to.equal(MAX_SUPPLY - 2);
      expect(await nft.priceInWei()).to.equal(PRICE);
      expect(await nft.artist()).to.equal(artist.address);
      expect(await nft.platform()).to.equal(platform.address);
    });

    it("should allow minting with correct payment", async function () {
      await expect(
        nft.connect(buyer).mint(buyer.address, { value: PRICE })
      )
        .to.emit(nft, "Minted")
        .withArgs(buyer.address, 2, PRICE);

      expect(await nft.ownerOf(2)).to.equal(buyer.address);
      expect(await nft.availableSupply()).to.equal(MAX_SUPPLY - 3);
    });

    it("should split payment 50/50 between artist and platform", async function () {
      const artistBalanceBefore = await ethers.provider.getBalance(
        artist.address
      );
      const platformBalanceBefore = await ethers.provider.getBalance(
        platform.address
      );

      await nft.connect(buyer).mint(buyer.address, { value: PRICE });

      const artistBalanceAfter = await ethers.provider.getBalance(
        artist.address
      );
      const platformBalanceAfter = await ethers.provider.getBalance(
        platform.address
      );

      const artistShare = PRICE / 2n;
      const platformShare = PRICE - artistShare;

      expect(artistBalanceAfter - artistBalanceBefore).to.equal(artistShare);
      expect(platformBalanceAfter - platformBalanceBefore).to.equal(
        platformShare
      );
    });

    it("should reject minting with insufficient payment", async function () {
      const lowPrice = ethers.parseEther("0.005");
      await expect(
        nft.connect(buyer).mint(buyer.address, { value: lowPrice })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("should reject minting when sold out", async function () {
      // Create a project with minimal supply (3 = 2 reserved + 1 available)
      await factory.createProject(
        "Limited",
        "LTD",
        3,
        PRICE,
        artist.address,
        PROJECT_URI
      );
      const limitedInfo = await factory.getProject(1);
      const limitedNft = await ethers.getContractAt(
        "OpenMusicNFT",
        limitedInfo.nftContract
      );

      // Mint the only available one
      await limitedNft
        .connect(buyer)
        .mint(buyer.address, { value: PRICE });

      // Try to mint again - should fail
      await expect(
        limitedNft.connect(buyer2).mint(buyer2.address, { value: PRICE })
      ).to.be.revertedWith("Sold out");
    });

    it("should allow platform to do platform mint", async function () {
      await nft.connect(platform).platformMint(buyer.address);
      expect(await nft.ownerOf(2)).to.equal(buyer.address);
      expect(await nft.availableSupply()).to.equal(MAX_SUPPLY - 3);
    });

    it("should reject platform mint from non-platform", async function () {
      await expect(
        nft.connect(artist).platformMint(buyer.address)
      ).to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
    });

    it("should return correct tokenURI", async function () {
      expect(await nft.tokenURI(0)).to.equal(PROJECT_URI);
    });

    it("should support multiple buyers", async function () {
      await nft.connect(buyer).mint(buyer.address, { value: PRICE });
      await nft.connect(buyer2).mint(buyer2.address, { value: PRICE });

      expect(await nft.ownerOf(2)).to.equal(buyer.address);
      expect(await nft.ownerOf(3)).to.equal(buyer2.address);
      expect(await nft.totalMinted()).to.equal(4);
      expect(await nft.availableSupply()).to.equal(MAX_SUPPLY - 4);
    });
  });
});

import CryptoJS from 'crypto-js';

/**
 * Block Class - Represents a single block in the blockchain
 * Each block contains tourist card data and is linked to previous block
 */
class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data; // Tourist card data
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0; // For mining (proof of work)
  }

  /**
   * Calculate hash of the block using SHA256
   * This creates a unique fingerprint for the block
   */
  calculateHash() {
    return CryptoJS.SHA256(
      this.index +
      this.previousHash +
      this.timestamp +
      JSON.stringify(this.data) +
      this.nonce
    ).toString();
  }

  /**
   * Mine block - Proof of Work
   * Makes blockchain tamper-proof by requiring computational work
   */
  mineBlock(difficulty) {
    // Create a string of zeros based on difficulty
    const target = Array(difficulty + 1).join('0');
    
    // Keep changing nonce until hash starts with required zeros
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    
    console.log(`Block mined: ${this.hash}`);
  }
}

/**
 * Blockchain Class - Main blockchain implementation
 * Manages the chain of blocks for tourist cards
 */
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2; // Number of leading zeros required in hash
    this.pendingTransactions = [];
  }

  /**
   * Create the first block in the chain (Genesis Block)
   */
  createGenesisBlock() {
    return new Block(0, Date.now(), {
      message: 'Tourist Safety Blockchain - Genesis Block',
      system: 'UTSE',
      version: '1.0'
    }, '0');
  }

  /**
   * Get the latest block in the chain
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Add a new block to the blockchain
   * @param {Object} touristCardData - Tourist card information
   */
  addBlock(touristCardData) {
    const newBlock = new Block(
      this.chain.length,
      Date.now(),
      touristCardData,
      this.getLatestBlock().hash
    );
    
    // Mine the block (proof of work)
    newBlock.mineBlock(this.difficulty);
    
    // Add to chain
    this.chain.push(newBlock);
    
    return newBlock;
  }

  /**
   * Verify if the blockchain is valid
   * Checks if any block has been tampered with
   */
  isChainValid() {
    // Start from 1 (skip genesis block)
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Verify current block's hash
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.log('Invalid hash at block', i);
        return false;
      }

      // Verify link to previous block
      if (currentBlock.previousHash !== previousBlock.hash) {
        console.log('Invalid previous hash at block', i);
        return false;
      }
    }

    return true;
  }

  /**
   * Get block by tourist ID
   */
  getBlockByTouristId(touristId) {
    for (let i = this.chain.length - 1; i >= 0; i--) {
      if (this.chain[i].data.touristId === touristId) {
        return this.chain[i];
      }
    }
    return null;
  }

  /**
   * Get all blocks for a specific user email
   */
  getBlocksByEmail(email) {
    return this.chain.filter(block => 
      block.data.email === email
    );
  }

  /**
   * Verify a specific tourist card
   */
  verifyTouristCard(touristId) {
    const block = this.getBlockByTouristId(touristId);
    
    if (!block) {
      return {
        verified: false,
        message: 'Tourist card not found in blockchain'
      };
    }

    // Check if blockchain is valid
    if (!this.isChainValid()) {
      return {
        verified: false,
        message: 'Blockchain has been tampered with',
        block
      };
    }

    return {
      verified: true,
      message: 'Tourist card is authentic and verified',
      block,
      blockIndex: block.index,
      timestamp: new Date(block.timestamp).toLocaleString()
    };
  }

  /**
   * Get blockchain statistics
   */
  getStats() {
    return {
      totalBlocks: this.chain.length,
      difficulty: this.difficulty,
      isValid: this.isChainValid(),
      totalTouristCards: this.chain.length - 1, // Excluding genesis block
      latestBlock: this.getLatestBlock()
    };
  }
}

// Create singleton instance
const touristBlockchain = new Blockchain();

export { Blockchain, Block, touristBlockchain };

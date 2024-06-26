import fs from 'fs';
import { config } from 'dotenv';
import { Command } from "commander";
import { Connection, Keypair } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';
import { loadWalletFromPrivateKeys, loadWallets } from '../utils/utils.js';
import { PumpTransaction } from '../utils/pumpTransaction.js';

const program = new Command();

// Set the name, version and description
program
  .version('1.0.0')
  .description('Pump.fun volume marker trading bot');

program
  .option('-t, --type <type>', 'Provide the sol amount to buy tokens')
  .option('-k, --key <key>', 'Provide the private key of your wallet')
  .option('-m, --mint <mint>', 'Provide the mint addres to buy or sell')
  .option('-a, --amount <amount>', 'Provide the sol amount to buy tokens')
  .option('-s, --slippage <slippage>', 'Provide the slippage by percentage');

program.parse(process.argv);

(async() => {
  const options = program.opts();
  const {type, key, mint, amount, slippage} = options;
  if (!type) {
    console.log('You should provide action - buy or sell.');
    return;
  }

  if (!amount || !slippage || !key || !mint) {
    console.log(amount, slippage, key, mint);
    console.log('You should provide the params - private key, mint, amount and slippage');
    return;
  }
  config();
  const pumpTransaction = new PumpTransaction('https://api.mainnet-beta.solana.com');
  let txid;
  switch(type) {
    case 'buy':
      txid = await pumpTransaction.buyOne({
        walletSecretKey: key,
        mintAddress: mint,
        amount: Number(amount),
        slippage: Number(slippage)
      });
      break;
    case 'sell':
      txid = await pumpTransaction.sellOne({
        walletSecretKey: key,
        mintAddress: mint,
        amount: Number(amount),
        slippage: Number(slippage)
      });
      break;
  }
  console.log(txid);
})();

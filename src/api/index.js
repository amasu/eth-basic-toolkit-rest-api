import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';

export default ({ config, db }) => {
	let api = Router();

	const ethers = require('ethers');
	const Wallet = require('ethers').Wallet;
	const providers = ethers.providers;

	const provider = providers.getDefaultProvider('rinkeby');

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	//GET /createWallet
	api.get('/createWallet', (req, res)=>{
		
		const wallet = Wallet.createRandom();
		
		let pk = wallet.privateKey;
		let addr = wallet.address;
		console.log('PK : '+ pk);
		console.log('Address : ' + addr);
		res.json({privateKey : pk, address : addr});
	});

	//GET /getBalance/:param
	api.get('/getBalance/:addr', (req, res)=>{
		const addr = req.params.addr;
	
		provider.getBalance(addr)
			.then((balance)=>{
				let ethBalance = ethers.utils.formatEther(balance);
				res.json({ balance : ethBalance});
				console.log("Balance : "+ ethBalance);
			});

		
	});

	//POST /transaction {privateKey, destination, amount} in the body as x-www-form-urlencoded !!
	api.post('/transaction',(req,res)=>{
			
			const privateKey = req.body.privateKey;
			const destination = req.body.destination;
			const amount = ethers.utils.parseEther(req.body.amount);

			const wallet  = new ethers.Wallet(privateKey);
			wallet.provider = provider;

			const transactionPromise = wallet.send(destination, amount);

			transactionPromise.then((transactionHash)=>{
				res.send(transactionHash);
			});

		});

	return api;
}

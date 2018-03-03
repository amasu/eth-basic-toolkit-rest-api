import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	//GET /createWallet
	api.get('/createWallet', (req, res)=>{
		res.json({ message: 'Here will be created the new wallet' });
	});

	//GET /getBalance/:param
	api.get('/getBalance/:addr', (req, res)=>{
		const addr = req.params.addr;
		res.json({message:`Returns the balance of the address: ${addr}`});
	});

	//POST /transaction {privateKey, destination, amount} 
	api.post('/transaction',(req,res)=>{
			
			let privateKey = req.body.privateKey;
			let destination = req.body.destination;
			let amount = req.body.amount;
			console.log(req.body);
			res.send(privateKey + ' ' + destination + ' ' + amount);
			
			//res.sendStatus(201);
		});

	return api;
}

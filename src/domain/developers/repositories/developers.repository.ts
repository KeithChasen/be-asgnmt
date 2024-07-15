// **************************************************************************
// Репозиторій імітує шар підключення до бази данних. Данні знаходяться в data.ts
// **************************************************************************

import { injectable } from 'inversify';
import { IDeveloper, IContract } from '../types'
import { contracts, developers } from './data'

@injectable()
export class DevelopersRepository {


	async getContractsByDeveloperId(developerId: string): Promise<IContract[]> {
		return contracts.filter(contract => contract.developerId === developerId);
	}

	async getDeveloperRevenue(developerId: string): Promise<number> {
		const developerContracts = await this.getContractsByDeveloperId(developerId);

		return developerContracts.reduce((total, next) => total + next.amount, 0);
	}

	async processDeveloperObject(developer: IDeveloper): Promise<IDeveloper> {
		const revenue = await this.getDeveloperRevenue(developer.id);

		return {
			...developer,
			revenue
		}
	}

	async getDevelopers(): Promise<IDeveloper[]>{
		const developerPromises = developers.map(developer => this.processDeveloperObject(developer));
		return Promise.all(developerPromises);
	}

	async getDeveloperById(id: string): Promise<IDeveloper>{
		return developers.find(d => d.id === id)
	}

	async getContracts(){
		return contracts
	}

}

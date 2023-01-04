import { PegoutDataProcessor } from "./pegout-data.processor";
import { PegoutStatusDataService } from './pegout-status-data-services/pegout-status-data.service';
import {BridgeService} from './bridge.service';


const mockedPegoutStatusDataService = <PegoutStatusDataService>{};
const bridgeService: BridgeService = <BridgeService> {};
const pegoutDataProcessor = new PegoutDataProcessor(mockedPegoutStatusDataService, bridgeService);

console.log("pegoutDataProcessor.process:");
console.log(pegoutDataProcessor.process);
console.log("---------------------------------------------------------")

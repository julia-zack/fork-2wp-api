import {inject} from '@loopback/core';
import {getLogger, Logger} from 'log4js';
import {BRIDGE_METHODS, getBridgeSignature} from '../utils/bridge-utils';
import FilteredBridgeTransactionProcessor from './filtered-bridge-transaction-processor';
import { BridgeDataFilterModel } from '../models/bridge-data-filter.model';
import { PegoutStatusDataService } from './pegout-status-data-services/pegout-status-data.service';
import ExtendedBridgeTx from './extended-bridge-tx';
import { BridgeEvent } from 'bridge-transaction-parser';
import { ServicesBindings } from '../dependency-injection-bindings';
import {BridgeService} from './bridge.service';



const pegnatoriesData = new Map();

export class PegnatoriesDataProcessor implements FilteredBridgeTransactionProcessor {
  private logger: Logger;
  private pegoutStatusDataService: PegoutStatusDataService;
  private bridgeService: BridgeService;

  constructor(
    @inject(ServicesBindings.PEGOUT_STATUS_DATA_SERVICE)
    pegoutStatusDataService: PegoutStatusDataService,
    @inject(ServicesBindings.BRIDGE_SERVICE)
    bridgeService: BridgeService) {
    this.logger = getLogger('pegnatoriesDataProcessor');
    this.pegoutStatusDataService = pegoutStatusDataService;
    this.bridgeService = bridgeService;
  }

  getFilters(): BridgeDataFilterModel[] {
    // TODO: add BRIDGE_METHODS.RELEASE_BTC = 'releaseBtc' when this method is available in the bridge abis.
    return [
      new BridgeDataFilterModel(getBridgeSignature(BRIDGE_METHODS.UPDATE_COLLECTIONS)),
      //new BridgeDataFilterModel(getBridgeSignature(BRIDGE_METHODS.ADD_SIGNATURE)),
      BridgeDataFilterModel.EMPTY_DATA_FILTER,
      //new BridgeDataFilterModel(getBridgeSignature(BRIDGE_METHODS.RELEASE_BTC))
    ];
  }

  async process(extendedBridgeTx: ExtendedBridgeTx): Promise<void> {
    try {
      this.logger.debug(`[process] Got tx ${extendedBridgeTx.txHash}`);

      const events: BridgeEvent[] = extendedBridgeTx.events;    

      events.forEach(
        event => {
            pegnatoriesData.set(event.arguments, extendedBridgeTx.createdOn)
            console.log(event)
        }
      )
      console.log("---------------------------------------------------------")
      console.log("pegnatoriesData:")
      console.log(pegnatoriesData)
      console.log("---------------------------------------------------------")
      
    } catch (e) {
      this.logger.error(`[process] error processing pegout: ${e}`);
    }
  }
}